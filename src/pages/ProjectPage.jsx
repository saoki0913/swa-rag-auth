import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import IconButton from "@mui/icons-material/Delete";
import DeleteIcon from "@mui/icons-material/Delete";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Tooltip from "@mui/material/Tooltip";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [spoUrl, setSpoUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("http://localhost:7071/projects");
      const data = await response.json();
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  const handleDeleteProject = async (projectName) => {
    //削除前に確認ダイアログを表示
    if (!window.confirm(`本当に「${projectName}」を削除しますか？`)) return; 

    try {
      //削除リクエストを送信
      const response = await fetch("http://localhost:7071/delete_project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName }),
      });

      if (response.ok) {
        // 削除対象のプロジェクトをフロントエンドの状態管理から削除
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.project_name !== projectName)
        );
        alert(`プロジェクト「${projectName}」を削除しました。`);
      } else {
        const errorData = await response.json();
        console.error("削除失敗:", errorData);
        alert(`プロジェクト「${projectName}」の削除に失敗しました。`);
      }
    } catch (error) {
      console.error("エラー: プロジェクト削除に失敗しました。", error);
      alert("プロジェクト削除中にエラーが発生しました。");
    }
  };


  const handleRegisterProject = async () => {
    if (!projectName || !spoUrl) {
      alert("プロジェクト名とSharePoint URLを入力してください。");
      return;
    }

    setIsRegistering(true);
    setSuccessMessage(""); // メッセージをリセット
    try {
      const response = await fetch("http://localhost:7071/resist_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, spo_url: spoUrl }),
      });
      const data = await response.json();
      // プロジェクトリストに追加
      setProjects((prevProjects) => [
        ...prevProjects,
        { project_name: projectName, spo_url: data.spo_url },
      ]);
      
      // 成功メッセージを表示
      setSuccessMessage(`プロジェクト「${projectName}」が正常に登録されました。`);
      setTimeout(() => setSuccessMessage(""), 5000); // 5秒後に消える

      // プロジェクトの一覧を再取得
      await fetchProjects();

      // フォームをリセット
      setProjectName("");
      setSpoUrl("");

    } catch (error) {
      console.error("エラー: プロジェクト登録に失敗しました。", error);
      alert("プロジェクト登録中にエラーが発生しました。");
    } finally {
      setIsRegistering(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar
        chatHistory={[]}
        onSelectChat={() => {}}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onHomeClick={handleHomeClick}
      />

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: isSidebarOpen ? 0 : "50px",
          transition: "margin-left 0.3s",
          display: "flex",
          flexDirection: "column",
          padding: "8px",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: 1.5,
              padding: 1,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "0.9rem", fontWeight: "bold" }} gutterBottom>
              プロジェクト登録
            </Typography>
            <TextField
              label="プロジェクト名"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              size="small"
              sx={{ fontSize: "0.75rem" }}
              InputLabelProps={{ style: { fontSize: "0.75rem" } }}
            />
            <TextField
              label="SharePoint URL"
              value={spoUrl}
              onChange={(e) => setSpoUrl(e.target.value)}
              size="small"
              sx={{ fontSize: "0.75rem" }}
              InputLabelProps={{ style: { fontSize: "0.75rem" } }}
            />
            <Button
              variant="contained"
              onClick={handleRegisterProject}
              disabled={isRegistering}
              sx={{
                fontSize: "0.75rem",
                padding: "4px 8px",
                backgroundColor: "#333333"
              }}
            >
              {isRegistering ? "登録中..." : "登録"}
            </Button>
              {successMessage && (
                <Typography
                  sx={{
                    color: "#228B22", // 深緑色
                    fontSize: "14px", // フォントサイズ
                    fontWeight: "bold", // 太字
                    marginTop: "10px", // 上部の余白
                  }}
                >
                  {successMessage}
                </Typography>
              )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "0.9rem", fontWeight: "bold", marginTop: "8px" }}
                gutterBottom
              >
                プロジェクト一覧
              </Typography>
              <Button
                variant="contained"
                onClick={fetchProjects}
                disabled={isUpdating}
                sx={{
                  fontSize: "0.85rem",
                  padding: "4px 6px",
                  minWidth: "50px",
                  backgroundColor: "#333333"
                }}
              >
                {isUpdating ? "更新中..." : "更新"}
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : projects.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2}}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
                        プロジェクト名
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
                        SharePoint URL
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                          "&:hover": { backgroundColor: "#E0E0E0" },
                        }}
                      >
                        <TableCell sx={{ fontSize: "0.75rem", borderBottom: "1px solid #ddd" }}>
                          {project.project_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem", borderBottom: "1px solid #ddd" }}>
                          <a
                            href={project.spo_url} //half属性でリンク先URLを指定
                            target="_blank" //新しいタブでリンクを開く
                            rel="noopener noreferrer" //セキュリティリスクを軽減
                            style={{ textDecoration: "none", color: "#1a73e8" }} // リンクの見た目を変更可能
                          >
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                color: "#333333", // 通常時の色
                                "&:hover": {
                                  color: "#1a73e8", // ホバー時の色
                                  textDecoration: "underline", // ホバー時の装飾
                                },
                                cursor: "pointer", // ホバー時にカーソルを変更
                              }}
                            >
                              {project.spo_url}
                            </Typography>
                          </a>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem", borderBottom: "1px solid #ddd" }}>
                          <Tooltip title="削除" placement="left">
                            <IconButton
                              size="small"
                              color="#333333"
                              onClick={() => handleDeleteProject(project.project_name)}
                              sx={{ padding: "0px" }}
                            >
                              <DeleteIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ fontSize: "0.8rem" }}>プロジェクトが見つかりません。</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectPage;
