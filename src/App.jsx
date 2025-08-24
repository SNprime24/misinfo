import React, { useMemo, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ResultSection from "./components/ResultSection";
import "./App.css";

// ---- COLOR SYSTEM (Light & Dark) ----
const lightColors = {
  bg: "rgb(245,245,245)",
  card: "rgba(255,255,255,0.8)",
  text: "rgb(15,23,42)",
  subtext: "rgba(15,23,42,0.7)",
  border: "rgba(15,23,42,0.1)",
  accent: "rgb(0,72,255)",
  midBlue: "rgb(20,50,200)",
  darkBlue: "rgb(10,30,120)",
};
const darkColors = {
  bg: "rgb(33,33,33)",
  card: "rgba(255,255,255,0.06)",
  text: "rgb(244,244,244)",
  subtext: "rgba(244,244,244,0.7)",
  border: "rgba(255,255,255,0.08)",
  accent: "rgb(0,72,255)",
  midBlue: "rgb(20,50,200)",
  darkBlue: "rgb(10,30,120)",
};

// robust toPercent - accepts 0..1 or 0..100
export function toPercent(x) {
  if (typeof x !== "number" || isNaN(x)) return 0;
  if (Math.abs(x) <= 1) return Math.max(0, Math.min(100, Math.round(x * 100)));
  return Math.max(0, Math.min(100, Math.round(x)));
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
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
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
          <div className="p-4 max-h-[70vh] overflow-auto" style={{ color: "var(--text)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const BASE = import.meta.env.VITE_API_URL || "";
  const API_URL = `${BASE}/api/v1/analysis/analyze`;

  // Updated dummy to match the backend schema you provided
  const dummy = {
    credibility_score: 15,
    category: "Health Misinformation",
    key_entities: ["Cinnamon", "Aging"],
    report_summary:
      "The claim that eating cinnamon can reverse aging is not supported by scientific evidence and promotes a false health remedy.",
    analysis:
      "This claim is not supported by credible scientific or medical sources. A review of information from trusted health organizations indicates that while cinnamon may have some health benefits, it is not a cure for aging, and excessive consumption can be harmful. This content poses a risk by promoting unverified health advice.",
    metrics: {
      clarity: 0.8,
      tone: 0.25,
      correctness: 0.05,
      originality: 0.4,
    },
    sources: [
      {
        name: "Reuters | Fact Check",
        url: "https://www.reuters.com/article/factcheck-cinnamon-health/fact-check-cinnamon-is-not-a-miracle-cure-idUSL1N2R21B5",
        credibility_score: 95,
      },
      {
        name: "AP News | Fact Check",
        url: "https://apnews.com/article/fact-checking-123456789",
        credibility_score: 92,
      },
    ],
    formal_report:
      "To Whom It May Concern,\n\nI am reporting a piece of online content for promoting potential misinformation.\n\nCategory of Misinformation: Health Misinformation\n\nOriginal Content Summary: The content claims that eating a spoonful of cinnamon can reverse the aging process.\n\nAnalysis: This claim is not supported by credible scientific or medical sources. A review of information from trusted health organizations indicates that while cinnamon may have some health benefits, it is not a cure for aging, and excessive consumption can be harmful. This content poses a risk by promoting unverified health advice.\n\nI request that you review this content for potential violation of your platform's policies regarding health misinformation.\n\nThank you.",
    raw: {
      ts: 1724578800000,
    },
  };

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    setInput("");
    try {
      const res = await axios.post(API_URL, { content: input }, { headers: { "Content-Type": "application/json" } });
      setResult(res.data);
    } catch (e) {
      console.warn("API error, showing demo payload", e?.message);
      setError("Could not reach the analysis service. Showing a demo result.");
      setResult(dummy);
    } finally {
      setLoading(false);
    }
  };

  // compute shown score from credibility_score (robust to 0..1 or 0..100)
  const score = toPercent(result?.credibility_score ?? result?.score ?? null);

  return (
    <div className="min-h-screen w-full" style={{ ...cssVars, background: "var(--bg)" }}>
      {/* HEADER */}
      <Header theme={theme} setTheme={setTheme} />

      {/* HERO 3D SECTION - fills viewport */}
      <HeroSection theme={theme} input={input} setInput={setInput} handleAnalyze={handleAnalyze} loading={loading} error={error} />

      {/* RESULTS SECTION (pass setter for raw modal) */}
      <ResultSection score={score} result={result} setRawOpen={setRawOpen} />

      {/* FOOTER */}
      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-4 text-sm" style={{ color: "var(--subtext)" }}>
          Built with React, Tailwind, and 3D (Spline/three.js). Paste your Spline scene URL in the code to enable the movable Spline experience.
        </div>
      </footer>

      {/* RAW JSON MODAL */}
      <Modal open={rawOpen} title="Raw Response" onClose={() => setRawOpen(false)}>
        <pre className="text-xs overflow-auto" style={{ color: "var(--text)" }}>
          {JSON.stringify(result ?? { hint: "Press Analyze to see a response." }, null, 2)}
        </pre>
      </Modal>
    </div>
  );
}
