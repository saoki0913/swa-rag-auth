// App.js
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import TextInput from "./components/TextInput";
import ChatArea from "./components/ChatArea";
import ProjectPage from "./components/ProjectPage";
import { Box, CircularProgress, Typography, TextField, Button } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

const MainApp = () => {
  //状態管理
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const navigate = useNavigate(); // React Routerフックを使用

  //サーバーからプロジェクト一覧を取得
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://func-rag.azurewebsites.net/projects");
      const data = await response.json();
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    }
  };

  const handleSelectProject = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleSendMessage = async (text) => {
    if (!selectedProject) {
      alert("プロジェクトを選択してください。");
      return;
    }

    setIsGenerating(true);
    const questionMessage = { type: "question", content: text };
    setMessages((prevMessages) => [...prevMessages, questionMessage]);

    try {
      const response = await fetch("http://func-rag.azurewebsites.net/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_question: text, project_name: selectedProject }),
      });
      const data = await response.json();
      console.log("API response:", data);

      const { answer, documentUrl, documentName, last_modified } = data;
      const answerMessage = {
        type: "answer",
        content: (
          <div>
            <p>
              <strong>回答:</strong> {answer}
            </p>
            <p>
              <strong>ファイル名:</strong> {documentName}
            </p>
            <p>
              <strong>最終更新時刻:</strong> {last_modified}
            </p>
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                  display: "inline-block",
                }}
              >
                {documentUrl}
              </a>
            </p>
          </div>
        ),
      };

      setMessages((prevMessages) => [...prevMessages, answerMessage]);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: prevHistory.length + 1,
          title: text.slice(0, 20) || "新しい会話",
          messages: [...messages, questionMessage, answerMessage],
        },
      ]);
    } catch (error) {
      console.error("エラー: チャット応答の取得に失敗しました。", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectChat = (chat) => {
    setMessages(chat.messages);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* プロジェクト選択のみ */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 2,
          gap: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <TextField
          select
          label="プロジェクトを選択"
          value={selectedProject}
          onClick={fetchProjects}
          onChange={handleSelectProject}
          size="small"
          sx={{ width: "200px", minWidth: "150px" }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="" disabled></option>
          {projects
            .filter((project) => project && project.project_name)
            .map((project, index) => (
              <option key={index} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
        </TextField>

        {/* 新たなページへ遷移するボタン */}
        <Button variant="contained" onClick={() => navigate("/project")}>
          プロジェクトページ
        </Button>
      </Box>

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <SideBar chatHistory={chatHistory} onSelectChat={handleSelectChat} />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
            <ChatArea messages={messages} />
          </Box>
          <Box
            sx={{
              padding: 2,
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {isGenerating && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={24} />
                <Typography>回答生成中...</Typography>
              </Box>
            )}
            {!isGenerating && (
              <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                <TextInput onSendMessage={handleSendMessage} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ルートを管理するコンポーネント
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/project" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
};

export default App;
