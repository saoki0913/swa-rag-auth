// App.js
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import TextInput from "./components/TextInput";
import ChatArea from "./components/ChatArea";
import ProjectPage from "./components/ProjectPage";
import logo from "./assets/logo.png"; // ロゴ画像をインポート
import { Box, CircularProgress, Typography, TextField, Button } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000", // プライマリカラーを黒
    },
    secondary: {
      main: "#333", // セカンダリカラー
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // おしゃれなフォントを指定
    button: {
      textTransform: "none", // ボタンのテキストを小文字のままに
    },
  },
});

const MainApp = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const navigate = useNavigate();

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
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          backgroundColor: "#f5f5f5", // 薄いグレー背景
          color: "#000", // 黒文字
          borderBottom: "1px solid #ddd", // ラインを薄いグレーに変更
        }}
      >
        {/* ロゴを表示 */}
        <img
          src={logo}
          alt="Company Logo"
          style={{
            height: "35px",
            marginLeft: "30px",
            display: "block",
          }}
        />

        {/* プロジェクト選択 */}
        <Box sx={{ display: "flex", gap: "16px" }}>
          <TextField
            select
            label="プロジェクトを選択"
            value={selectedProject}
            onClick={fetchProjects}
            onChange={handleSelectProject}
            size="small"
            sx={{
              backgroundColor: "#fff", // 背景を白に
              borderRadius: "4px",
              width: "200px",
              minWidth: "150px",
            }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="" disabled></option>
            {projects.map((project, index) => (
              <option key={index} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
          </TextField>
          <Button
            variant="contained"
            onClick={() => navigate("/project")}
            sx={{
              backgroundColor: "#000", // ボタンを黒に
              color: "#fff",
              "&:hover": {
                backgroundColor: "#333", // ホバー時を濃いグレーに
              },
            }}
          >
            プロジェクトページ
          </Button>
        </Box>
      </Box>

      {/* メインコンテンツ */}
      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <SideBar chatHistory={chatHistory} onSelectChat={handleSelectChat} />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              padding: "16px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <ChatArea messages={messages} />
          </Box>
          <Box
            sx={{
              padding: "16px",
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "#fff",
            }}
          >
            {isGenerating ? (
              <Box display="flex" alignItems="center" gap="8px">
                <CircularProgress size={24} />
                <Typography>回答生成中...</Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: "16px", width: "100%" }}>
                <TextInput onSendMessage={handleSendMessage} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// ルート設定
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/project" element={<ProjectPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
