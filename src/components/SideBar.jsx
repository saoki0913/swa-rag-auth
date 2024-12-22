import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import ArchiveIcon from "@mui/icons-material/Archive";

const SideBar = ({
  chatHistory,
  onSelectChat,
  isSidebarOpen,
  toggleSidebar,
  onDeleteChat,
  onViewDetails,
  onArchiveChat,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null); // メニューのアンカー
  const [selectedChat, setSelectedChat] = useState(null); // 選択されたチャット
  const navigate = useNavigate(); // useNavigateを利用

  const handleMenuOpen = (event, chat) => {
    setMenuAnchor(event.currentTarget);
    setSelectedChat(chat);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedChat(null);
  };

  const handleViewDetails = () => {
    onViewDetails(selectedChat);
    handleMenuClose();
  };

  const handleDeleteChat = () => {
    onDeleteChat(selectedChat);
    handleMenuClose();
  };

  const handleArchiveChat = () => {
    onArchiveChat(selectedChat);
    handleMenuClose();
  };

  const handleHomeClick = () => {
    navigate("/"); // ホームにリダイレクト
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* サイドバー */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isSidebarOpen}
        sx={{
          width: isSidebarOpen ? 200 : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 200,
            boxSizing: "border-box",
            transition: "width 0.3s",
            overflowY: "auto",
            // スクロールバーを非表示
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox用
          },
        }}
      >
        <Box sx={{ width: 200 }}>
          {/* ヘッダー部分 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
            }}
          >
            <Tooltip title="メニューを閉じる">
              <IconButton onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Tooltip title="ホーム">
                <IconButton onClick={handleHomeClick}>
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="検索">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="設定">
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* チャット履歴リスト */}
          <Box sx={{ padding: "8px" }}>
            <Typography variant="h6" sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              チャット履歴
            </Typography>
            <List>
              {chatHistory.map((chat, index) => (
                <ListItem
                  button
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <ListItemText
                    primary={chat.title}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                    onClick={() => onSelectChat(chat)}
                  />
                  <Tooltip title="その他の操作">
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, chat)}
                      sx={{
                        padding: "4px",
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      {/* 3つの点のメニュー */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          詳細を確認
        </MenuItem>
        <MenuItem onClick={handleArchiveChat}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          アーカイブに登録
        </MenuItem>
        <MenuItem onClick={handleDeleteChat}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          履歴を削除
        </MenuItem>
      </Menu>

      {/* サイドバーが非表示のときの再表示アイコン */}
      {!isSidebarOpen && (
        <Tooltip title="メニューを開く">
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: "fixed",
              top: "15px",
              left: "20px",
              zIndex: 700,
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <MenuIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SideBar;
