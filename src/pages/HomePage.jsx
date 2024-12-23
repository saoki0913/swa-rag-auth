import React, { useState } from "react";
import SideBar from "../components/SideBar";
import TextInput from "../components/TextInput";
import ChatArea from "../components/ChatArea";
import logo from "../assets/logo.png"; // ロゴ画像をインポート
import { Box, CircularProgress, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MainApp = () => {
  const [chatHistory, setChatHistory] = useState([]);//チャット履歴を格納する配列
  const [messages, setMessages] = useState([]); //現在のチャットセッションのメッセージリスト
  const [isGenerating, setIsGenerating] = useState(false);//メッセージの応答生成中かを示すフラグ
  const [projects, setProjects] = useState([]);//利用可能なプロジェクト一覧
  const [selectedProject, setSelectedProject] = useState("");//現在選択されているプロジェクト名
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);//サイドバーが開いているかを示すフラグ

  const navigate = useNavigate();

  //プロジェクト一覧を取得する非同期関数
  const fetchProjects = async () => {
    try {
      const response = await fetch("https://func-rag.azurewebsites.net/projects");
      const data = await response.json();
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    }
  };
  
  // ドロップダウンでプロジェクトを選択した際に呼び出され,selectedProjectを更新する関数
  const handleSelectProject = (event) => {
    setSelectedProject(event.target.value);
  };

  // ユーザーがメッセージを送信した際に呼び出される関数
  const handleSendMessage = async (text) => {
    // selectedProjectが未選択の場合、警告を表示する．
    if (!selectedProject) {
      alert("プロジェクトを選択してください。");
      return;
    }

    setIsGenerating(true);
    const questionMessage = { type: "question", content: text };
    setMessages((prevMessages) => [...prevMessages, questionMessage]);

    try {
      // APIエンドポイントにユーザーの質問を送信
      const response = await fetch("https://func-rag.azurewebsites.net/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_question: text, project_name: selectedProject }),
      });
      const data = await response.json();
      const { answer, documentUrl, documentName, last_modified } = data;
      
      // 回答の各プロパティを設定．
      const answerMessage = {
        type: "answer",
        content: (
          <div>
            <p><strong>回答:</strong> {answer}</p>
            <p><strong>ファイル名:</strong> {documentName}</p>
            <p><strong>最終更新時刻:</strong> {last_modified}</p>
            <p>
              <strong>URL:</strong> <a href={documentUrl} target="_blank" rel="noopener noreferrer">{documentUrl}</a>
            </p>
          </div>
        ),
      };
      // 新しいメッセージをmessagesとchatHistoryに追加
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
  // チャット履歴をクリックした際に、その履歴をmessages状態に復元
  const handleSelectChat = (chat) => {
    setMessages(chat.messages);
  };
  // サイドバーの開閉状態を切り替える
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* サイドバー */}
      <SideBar
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* ページ全体 */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column"

        }}
      >
        {/* ヘッダー */}
        <Box
          sx={{
            display: "flex",
            height: "50px", // 固定の高さを指定
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "#f5f5f5", // ヘッダーの背景を薄いグレーに設定
            color: "#000",
            borderBottom: "1px solid #ddd",
            flexShrink: 0, // ヘッダーがスクロールの影響を受けないように
          }}
        >
          <img src={logo} alt="Company Logo" style={{ height: "35px", marginLeft: "45px" }} />
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <TextField
              select
              label="プロジェクトを選択"
              value={selectedProject}
              onClick={fetchProjects}
              onChange={handleSelectProject}
              size="small"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "4px",
                width: "150px",
                minWidth: "120px"
              }}
              InputLabelProps={{
                style: { fontSize: "0.75rem" },
              }}
              SelectProps={{
                native: true,
                sx: { fontSize: "0.75rem" },
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
                backgroundColor: "#333333",
                color: "#fff",
                fontSize: "0.85rem",
                padding: "4px 12px",
                minWidth: "120px",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              プロジェクトページ
            </Button>
          </Box>
        </Box>

       {/* メインコンテンツ */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto", 
            padding: "16px",
            backgroundColor: "white",
            borderBottom: "none", // フッターとの境界線を削除
          }}
        >
          <ChatArea messages={messages} />
        </Box>

        {/* フッター部分 */}
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            // flexShrink: 0, // フッターがスクロールの影響を受けないように
            backgroundColor: "white", // メインコンテンツと同じ背景色に統一
            borderTop: "none", // 境界線を削除
          }}
        >
          {isGenerating ? (
            <Box display="flex" alignItems="center" gap="8px">
              <CircularProgress size={24} />
              <Typography>回答生成中...</Typography>
            </Box>
          ) : (
            <TextInput onSendMessage={handleSendMessage} />
          )}
        </Box>
      </Box>
    </Box>
  );
};


export default MainApp;
