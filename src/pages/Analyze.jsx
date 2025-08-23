// src/Analyze.jsx
import React, { useState } from "react";
import axios from "axios";

const DUMMY_RESPONSE = {
  score: 78,
  highlights: [
    { text: "This is a sentence with an issue", from: 0, to: 29, type: "clarity" },
    { text: "Another flagged phrase", from: 54, to: 72, type: "tone" },
  ],
  suggestions: [
    "Make the opening sentence shorter.",
    "Avoid passive voice in paragraph two.",
    "Add a clear call-to-action at the end.",
  ],
  metadata: {
    words: 234,
    reading_time_mins: 1.6,
  },
};

function ScoreRing({ value = 0, size = 96, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <circle
            r={radius}
            fill="transparent"
            stroke="rgb(0,72,255)"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="absolute flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center">
          <div className="text-xl font-semibold">{pct}%</div>
          <div className="text-xs text-gray-400">Overall</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Splits `text` into an ordered array of segments with optional highlight metadata.
 * expects highlights to be non-overlapping or lightly overlapping; this function assumes non-overlap.
 */
function buildSegments(text = "", highlights = []) {
  if (!text) return [{ text: "" }];

  // Filter valid highlights and sort by "from"
  const hl = (highlights || [])
    .map((h) => ({
      from: Math.max(0, Math.min(text.length, parseInt(h.from || 0, 10))),
      to: Math.max(0, Math.min(text.length, parseInt(h.to || 0, 10))),
      type: h.type || "note",
    }))
    .filter((h) => h.to > h.from)
    .sort((a, b) => a.from - b.from);

  const segments = [];
  let cursor = 0;

  for (const h of hl) {
    if (cursor < h.from) {
      segments.push({ text: text.slice(cursor, h.from) });
    }
    segments.push({
      text: text.slice(h.from, h.to),
      highlight: true,
      type: h.type,
    });
    cursor = h.to;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }
  return segments;
}

export default function Analyze() {
  const [text, setText] = useState(
    "This is a sentence with an issue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Another flagged phrase appears here."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showJSON, setShowJSON] = useState(false);

  const endpoint = import.meta.env.VITE_PRIYA_API || "http://localhost:4000/analyze";

  async function handleAnalyze() {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await axios.post(endpoint, { text }, { timeout: 7000 });
      // expect { score, highlights, suggestions, metadata, ... }
      setResult(res.data);
    } catch (err) {
      // fallback to dummy but show helpful error
      setError(
        "Unable to reach backend — showing a local demo result. Configure VITE_PRIYA_API to point to Priya's API."
      );
      // small pause so spinner is visible
      await new Promise((r) => setTimeout(r, 400));
      setResult(DUMMY_RESPONSE);
    } finally {
      setLoading(false);
    }
  }

  function handleExportJSON() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopyJSON() {
    if (!result) return;
    navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
    // optional tiny UX: we could set a toast, but keep it simple here
  }

  const metrics = result?.metrics ?? (result?.score
    ? {
        clarity: Math.min(100, Math.round(result.score * 0.95)),
        tone: Math.min(100, Math.round(result.score * 0.88)),
        correctness: Math.min(100, Math.round(result.score * 0.9)),
      }
    : null);

  // build highlighted segments from the text using result.highlights if present; otherwise from DUMMY_RESPONSE highlights
  const highlightsSource = result?.highlights ?? [];
  const segments = buildSegments(text, highlightsSource);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analyzer</h1>
            <p className="text-sm text-gray-400">Paste text, click Analyze, and get actionable feedback.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              disabled={!result}
              className="px-3 py-2 rounded-xl border border-gray-700 text-sm disabled:opacity-50"
            >
              Export JSON
            </button>
            <button
              onClick={handleCopyJSON}
              disabled={!result}
              className="px-3 py-2 rounded-xl border border-gray-700 text-sm disabled:opacity-50"
            >
              Copy JSON
            </button>
            <button
              onClick={() => {
                setResult(null);
                setError(null);
                setShowJSON(false);
              }}
              className="px-3 py-2 rounded-xl border border-gray-700 text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Input card */}
        <div className="rounded-2xl bg-white/5 p-4 md:p-6 border border-gray-800">
          <label htmlFor="analyze-text" className="text-sm text-gray-300 mb-2 block">
            Text to analyze
          </label>
          <textarea
            id="analyze-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full resize-none bg-transparent border border-gray-700 rounded-xl p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Paste or type content you'd like the analyzer to check..."
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-xl font-semibold"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                "Analyze"
              )}
            </button>

            <div className="text-sm text-gray-400">
              {error ? <span className="text-amber-300">{error}</span> : <span>Ready</span>}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Score */}
          <div className="md:col-span-1 rounded-2xl bg-white/5 p-4 border border-gray-800 flex flex-col items-center">
            <div className="mb-3 relative">
              <ScoreRing value={result?.score ?? 0} />
            </div>

            <div className="w-full space-y-3 mt-4">
              {metrics ? (
                <>
                  {["clarity", "tone", "correctness"].map((k) => (
                    <div key={k}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{k}</span>
                        <span>{metrics[k]}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${metrics[k]}%` }}
                          className="h-2 rounded-full"
                          // gradient thumb
                        //   className="h-2 rounded-full"
                        >
                          <div style={{ width: `${metrics[k]}%` }} className={`h-2 rounded-full`} />
                        </div>
                        <div style={{ width: `${metrics[k]}%` }} className="h-2 rounded-full bg-blue-600" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-sm text-gray-400">Run an analysis to see metrics.</div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-400 w-full">
              <div>Words: <strong className="text-white">{result?.metadata?.words ?? "-"}</strong></div>
              <div>Reading time: <strong className="text-white">{result?.metadata?.reading_time_mins ?? "-"} mins</strong></div>
            </div>
          </div>

          {/* Middle + Right: Summary, highlights, suggestions */}
          <div className="md:col-span-2 space-y-4">
            {/* Summary card */}
            <div className="rounded-2xl bg-white/5 p-4 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p className="text-sm text-gray-400">High-level takeaways and highlights</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowJSON(true)}
                    className="px-3 py-1 rounded-lg border border-gray-700 text-sm"
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-200">
                {result?.summary ? (
                  <p>{result.summary}</p>
                ) : (
                  <p className="text-gray-400">No summary from backend. Try analyzing some text.</p>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Text preview (highlights)</h4>
                <div className="bg-gray-800/40 rounded-lg p-4 text-sm leading-relaxed">
                  {/* Render text with highlighted spans */}
                  {segments.map((seg, i) => {
                    if (seg.highlight) {
                      // map highlight types to colors
                      const cls =
                        seg.type === "clarity"
                          ? "bg-amber-400/20 border-amber-400 text-amber-200"
                          : seg.type === "tone"
                          ? "bg-purple-500/20 border-purple-400 text-purple-200"
                          : seg.type === "correctness"
                          ? "bg-green-500/20 border-green-400 text-green-200"
                          : "bg-blue-500/12 border-blue-400 text-blue-200";

                      return (
                        <span
                          key={i}
                          className={`px-1 py-0.5 rounded-md border ${cls}`}
                          title={seg.type}
                        >
                          {seg.text}
                        </span>
                      );
                    }
                    return <span key={i}>{seg.text}</span>;
                  })}
                </div>
              </div>
            </div>

            {/* Suggestions + Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4 border border-gray-800">
                <h4 className="font-semibold">Top Suggestions</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {(result?.suggestions ?? []).length > 0 ? (
                    result.suggestions.map((s, idx) => (
                      <li key={idx} className="bg-gray-800/30 p-3 rounded-md">
                        {s}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No suggestions yet — run an analysis.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 border border-gray-800">
                <h4 className="font-semibold">Detected Highlights</h4>
                <div className="mt-3 space-y-2">
                  {(result?.highlights ?? []).length > 0 ? (
                    result.highlights.map((h, idx) => (
                      <div key={idx} className="p-2 rounded-md border border-gray-700 flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full ${h.type === "clarity" ? "bg-amber-400" : h.type === "tone" ? "bg-purple-400" : "bg-blue-400"}`} />
                        <div className="text-sm">
                          <div className="font-medium text-white">{h.text}</div>
                          <div className="text-xs text-gray-400 capitalize">{h.type}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No highlights detected.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / help */}
        <div className="text-sm text-gray-500">
          Tip: Configure <code className="bg-gray-800/40 px-1 rounded">VITE_PRIYA_API</code> in your .env to point to Priya's backend.
        </div>
      </div>

      {/* RAW JSON modal */}
      {showJSON && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowJSON(false)} />
          <div className="relative max-w-3xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Raw JSON</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify(result, null, 2));
                  }}
                  className="px-3 py-1 rounded-md border border-gray-700 text-sm"
                >
                  Copy
                </button>
                <button onClick={() => setShowJSON(false)} className="px-3 py-1 rounded-md border border-gray-700 text-sm">
                  Close
                </button>
              </div>
            </div>
            <pre className="text-xs max-h-[60vh] overflow-auto bg-black/30 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
