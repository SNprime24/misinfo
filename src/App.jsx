import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, Info, Moon, Sun, X, ExternalLink } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ResultSection from "./components/ResultSection";
import "./App.css";

let SPLINE_URL = ""; // e.g. "https://prod.spline.design/abcd1234/scene.splinecode"

// ---- COLOR SYSTEM (Light & Dark) ----
// Using CSS variables so we don't rely on Tailwind's dark mode config.
const lightColors = {
  bg: "rgb(245,245,245)", // Light background
  card: "rgba(255,255,255,0.8)",
  text: "rgb(15,23,42)",
  subtext: "rgba(15,23,42,0.7)",
  border: "rgba(15,23,42,0.1)",
  accent: "rgb(0,72,255)", // Bright Electric Blue (Flower)
  midBlue: "rgb(20,50,200)",
  darkBlue: "rgb(10,30,120)",
};
const darkColors = {
  bg: "rgb(33,33,33)", // Dominant Black/Dark Gray
  card: "rgba(255,255,255,0.06)",
  text: "rgb(244,244,244)",
  subtext: "rgba(244,244,244,0.7)",
  border: "rgba(255,255,255,0.08)",
  accent: "rgb(0,72,255)", // Bright Electric Blue (Flower)
  midBlue: "rgb(20,50,200)",
  darkBlue: "rgb(10,30,120)",
};

function toPercent(x) {
  if (typeof x !== "number" || isNaN(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x * 100)));
}

// ---- MODAL ----
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-3xl rounded-2xl shadow-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:opacity-80"
              aria-label="Close modal"
            >
              <X size={18} style={{ color: "var(--text)" }} />
            </button>
          </div>
          <div
            className="p-4 max-h-[70vh] overflow-auto"
            style={{ color: "var(--text)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- PROGRESS BAR ----

// ---- HIGHLIGHT TAG ----
// function Highlight({ text }) {
//   return (
//     <span
//       className="px-2 py-1 rounded-lg text-xs font-medium border"
//       style={{
//         borderColor: "var(--border)",
//         color: "var(--accent)",
//         background: "color-mix(in oklab, var(--accent) 8%, transparent)",
//       }}
//     >
//       {text}
//     </span>
//   );
// }

// ---- MAIN APP ----
export default function App() {
  const [theme, setTheme] = useState("dark");
  const palette = theme === "dark" ? darkColors : lightColors;

  const cssVars = useMemo(
    () => ({
      ["--bg"]: palette.bg,
      ["--card"]: palette.card,
      ["--text"]: palette.text,
      ["--subtext"]: palette.subtext,
      ["--border"]: palette.border,
      ["--accent"]: palette.accent,
      ["--midBlue"]: palette.midBlue,
      ["--darkBlue"]: palette.darkBlue,
    }),
    [palette]
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawOpen, setRawOpen] = useState(false);
  const [result, setResult] = useState(null);
  ``;
  const BASE = import.meta.env.VITE_API_URL || "";
  const API_URL = `${BASE}/api/v1/analysis/analyze`;

  const dummy = {
    score: 0,
    summary: "Error Occured",
    highlights: ["Error"],
    metrics: { clarity: 0, tone: 0, correctness: 0, originality: 0 },
    entities: [],
    tips: [],
    raw: { example: false, ts: Date.now() },
  };

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(
        API_URL,
        { content: input },
        { headers: { "Content-Type": "application/json" } }
      );
      setResult(res.data);
    } catch (e) {
      console.warn("API error, showing dummy payload", e?.message);
      setError("Could not reach the analysis service. Showing a demo result.");
      setResult(dummy);
    } finally {
      setLoading(false);
    }
  };

  const score = toPercent(result?.score);

  return (
    <div
      className="min-h-screen w-full"
      style={{ ...cssVars, background: "var(--bg)" }}
    >
      {/* HEADER */}
      <Header theme={theme} setTheme={setTheme} />

      {/* HERO 3D SECTION - fills viewport */}
      <HeroSection
        theme={theme}
        input={input}
        setInput={setInput}
        handleAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      {/* RESULTS SECTION */}
      <ResultSection score={score} result={result} />

      {/* FOOTER */}
      <footer className="py-10">
        <div
          className="max-w-6xl mx-auto px-4 text-sm"
          style={{ color: "var(--subtext)" }}
        >
          Built with React, Tailwind, and 3D (Spline/three.js). Paste your
          Spline scene URL in the code to enable the movable Spline experience.
        </div>
      </footer>

      {/* RAW JSON MODAL */}
      <Modal
        open={rawOpen}
        title="Raw Response"
        onClose={() => setRawOpen(false)}
      >
        <pre className="text-xs overflow-auto" style={{ color: "var(--text)" }}>
          {JSON.stringify(
            result ?? { hint: "Press Analyze to see a response." },
            null,
            2
          )}
        </pre>
      </Modal>
    </div>
  );
}
