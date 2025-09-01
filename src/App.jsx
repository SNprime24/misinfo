import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ReportsPage from "./pages/ReportsPage";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("theme") ?? localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage", e);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
        <Route
          path="/dashboard"
          element={<Dashboard theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/view-reports"
          element={<ReportsPage theme={theme} setTheme={setTheme} />}
        />
      </Routes>
    </Router>
  );
}
