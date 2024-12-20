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

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [spoUrl, setSpoUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // プロジェクト一覧を取得
  const fetchProjects = async () => {
    setIsUpdating(true); // 更新中の状態を管理
    try {
      const response = await fetch("http://func-rag.azurewebsites.net/projects");
      const data = await response.json();
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    } finally {
      setLoading(false);
      setIsUpdating(false); // 更新が完了したら状態をリセット
    }
  };

  // 初期レンダリング時にデータ取得
  useEffect(() => {
    fetchProjects();
  }, []);

  // 新しいプロジェクトをサーバーに登録
  const handleRegisterProject = async () => {
    if (!projectName || !spoUrl) {
      alert("プロジェクト名とSharePoint URLを入力してください。");
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch("http://func-rag.azurewebsites.net/resist_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, spo_url: spoUrl }),
      });
      const data = await response.json();

      setProjects((prevProjects) =>
        Array.isArray(prevProjects)
          ? [...prevProjects, { project_name: data.project_name, spo_url: spoUrl }]
          : [{ project_name: data.project_name, spo_url: spoUrl }]
      );

      setProjectName(""); // 入力フィールドをリセット
      setSpoUrl("");
    } catch (error) {
      console.error("エラー: プロジェクト登録に失敗しました。", error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Box sx={{ display: "flex", p: 4, gap: 4 }}>
      {/* プロジェクト登録フォーム */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "300px",
          border: "1px solid #ddd",
          borderRadius: 2,
          padding: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h6" gutterBottom>
          プロジェクト登録
        </Typography>
        <TextField
          label="プロジェクト名"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          size="small"
        />
        <TextField
          label="SharePoint URL"
          value={spoUrl}
          onChange={(e) => setSpoUrl(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleRegisterProject}
          disabled={isRegistering}
        >
          {isRegistering ? "登録中..." : "登録"}
        </Button>
      </Box>

      {/* プロジェクト一覧 */}
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant="h5">プロジェクト一覧</Typography>
          <Button
            variant="outlined"
            onClick={fetchProjects}
            disabled={isUpdating}
          >
            {isUpdating ? "更新中..." : "更新"}
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : projects.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>プロジェクト名</TableCell>
                  <TableCell>SharePoint URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell>{project.project_name}</TableCell>
                    <TableCell>{project.spo_url}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>プロジェクトが見つかりません。</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProjectPage;
