import React from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const ChatArea = ({ messages }) => {
  return (
    <Box
      sx={{
        padding: "8px",
        overflowY: "auto", // スクロール可能に設定
        height: "100%",
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column", // アイコンと吹き出しを縦方向に並べる
            alignItems: message.type === "answer" ? "flex-start" : "flex-end",
            marginBottom: "8px", // 吹き出し間の間隔を少し増やす
          }}
        >
          {/* チャットの回答用アイコン */}
          {message.type === "answer" && (
            <Avatar
              sx={{
                bgcolor: "#f5f5f5", // アイコンの背景色
                color: "text.primary",
                width: 24,
                height: 24,
                fontSize: "1rem",
                marginBottom: "4px", // アイコンと吹き出しの間の余白
              }}
            >
              <SupportAgentIcon fontSize="small" />
            </Avatar>
          )}

          {/* 吹き出し */}
          <Paper
            sx={{
              padding: "10px 15px",
              borderRadius: "10px",
              maxWidth: "70%", // 吹き出しの幅を調整
              backgroundColor: message.type === "answer" ? "#f5f5f5" : "#FAFAFA", // 回答は薄いグレー、質問は白
              wordBreak: "break-word", // URLや長い単語が吹き出し内で折り返される
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.85rem", // 文字サイズを調整
                color: "text.primary",
                fontWeight: "normal",
              }}
            >
              {message.content}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ChatArea;
