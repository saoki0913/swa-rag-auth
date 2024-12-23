// App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000", // プライマリカラーを黒
    },
    secondary: {
      main: "#F8F8F8", // セカンダリカラー
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // おしゃれなフォントを指定
    button: {
      textTransform: "none", // ボタンのテキストを小文字のままに
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
