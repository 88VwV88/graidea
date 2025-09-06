import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { Route, Routes, BrowserRouter as Router } from "react-router";
import Home from "./pages/home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
      </Routes>
    </Router>
  </StrictMode>
);
