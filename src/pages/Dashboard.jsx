import React, { useMemo, useState } from "react";
import Graph from "../components/Graph2";
import Header from "../components/Header";

// ----------------- Color Palettes -----------------

const darkColors = {
  bg: "rgb(11, 22, 44)", // Deep Navy
  card: "rgb(18, 32, 58)", // Slightly Lighter Navy for cards
  border: "rgb(30, 48, 80)", // Subtle Border
  text: "rgb(200, 220, 255)", // Light Powder Blue
  subtext: "rgb(120, 140, 170)", // Muted Slate Blue

  // Primary Blue Accents
  accentBlue: "rgb(6, 165, 225)", // Bright Cyan-Blue
  midBlue: "rgb(50, 110, 220)", // Classic Blue
  darkBlue: "rgb(10, 40, 120)", // Deep Royal Blue

  // New Green Accents
  accentGreen: "rgb(0, 255, 135)", // Vibrant Green
  midGreen: "rgb(50, 200, 100)", // A slightly softer green
  darkGreen: "rgb(0, 150, 70)", // A deeper green
};

const darkAccents = {
  // Gradients
  gradientBlueGreen:
    "linear-gradient(to right, rgb(6, 165, 225), rgb(0, 255, 135))",
  gradientBlue: "linear-gradient(to top, rgb(50, 110, 220), rgb(6, 165, 225))",
  gradientGreen: "linear-gradient(to top, rgb(50, 200, 100), rgb(0, 255, 135))",

  // Specific element colors for theme consistency
  line: "rgb(6, 165, 225)",
  barPrimary: "rgb(0, 255, 135)",
  barSecondary: "rgb(50, 110, 220)",
  mapPin: "rgb(0, 255, 135)",
  highlight: "rgb(6, 165, 225)",

  // Color array for multi-item charts like Pie/Polar
  palette: [
    darkColors.accentBlue,
    darkColors.accentGreen,
    "rgb(124, 58, 237)", // Violet
    darkColors.midBlue,
    darkColors.midGreen,
    "rgb(249, 115, 22)", // Orange
  ],
};

const lightColors = {
  bg: "rgb(248, 250, 252)",
  card: "rgba(255, 255, 255, 0.9)",
  text: "rgb(15, 23, 42)",
  subtext: "rgba(15, 23, 42, 0.66)",
  border: "rgba(15, 23, 42, 0.06)",
  accent: "rgb(0, 110, 255)",
  midBlue: "rgb(20, 90, 200)",
  darkBlue: "rgb(8, 30, 110)",
};

const lightAccents = {
  // Gradients for light theme
  gradientBlueGreen: `linear-gradient(to right, ${lightColors.accent}, #10b981)`,
  gradientBlue: `linear-gradient(to top, ${lightColors.midBlue}, ${lightColors.accent})`,
  gradientGreen: "linear-gradient(to top, #34d399, #10b981)",

  // Specific element colors
  line: lightColors.accent,
  barPrimary: "#10b981",
  barSecondary: lightColors.midBlue,
  mapPin: "#10b981",
  highlight: lightColors.accent,

  // Palette for light theme charts
  palette: ["#0ea5e9", "#10b981", "#7c3aed", "#3b82f6", "#f59e0b", "#ef4444"],
};

// ----------------- Small helpers -----------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pointsToPath = (pts) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};
const pieSlicePath = (cx, cy, r, startAngle, endAngle) => {
  const [x1, y1] = polarToCartesian(cx, cy, r, endAngle);
  const [x0, y0] = polarToCartesian(cx, cy, r, startAngle);
  const laf = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${laf} 1 ${x1} ${y1} Z`;
};

// ----------------- SVG chart primitives -----------------
function Sparkline({ data = [], width = 140, height = 36 }) {
  const pad = 4;
  const w = width,
    h = height;
  const min = Math.min(...data),
    max = Math.max(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (w - pad * 2) + pad;
    const y = h - ((d - min) / (max - min || 1)) * (h - pad * 2) - pad;
    return [x, y];
  });
  const d = pointsToPath(pts);
  const last = pts[pts.length - 1] || [0, 0];
  return (
    <svg width={w} height={h}>
      <path
        d={d}
        stroke="var(--accentGreen)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill="var(--accentGreen)" />
    </svg>
  );
}

function LineChart({ data = [], w = 320, h = 140 }) {
  const pad = 14;
  const min = Math.min(...data),
    max = Math.max(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (w - pad * 2) + pad;
    const y = h - ((d - min) / (max - min || 1)) * (h - pad * 2) - pad;
    return [x, y];
  });
  const path = pointsToPath(pts);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke="var(--midBlue)"
        strokeWidth="3"
        opacity="0.12"
        strokeLinecap="round"
      />
      <path
        d={path}
        fill="none"
        stroke="var(--accentBlue)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AreaChart({ data = [], w = 320, h = 140 }) {
  const pad = 14;
  const min = Math.min(...data),
    max = Math.max(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (w - pad * 2) + pad;
    const y = h - ((d - min) / (max - min || 1)) * (h - pad * 2) - pad;
    return [x, y];
  });
  const top = pointsToPath(pts);
  const bottom = `L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="aGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accentGreen)" stopOpacity="0.88" />
          <stop offset="100%" stopColor="var(--midGreen)" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path d={`${top} ${bottom}`} fill="url(#aGrad)" />
      <path d={top} fill="none" stroke="var(--darkGreen)" strokeWidth="1.25" />
    </svg>
  );
}

function BarChart({ data = [], w = 320, h = 140 }) {
  const pad = 14;
  const count = data.length;
  const bw = (w - pad * 2) / (count || 1) - 8;
  const max = Math.max(...data, 1);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="barG2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--barSecondary)" />
          <stop offset="100%" stopColor="var(--barPrimary)" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const x = pad + i * (bw + 8);
        const barH = (v / max) * (h - pad * 2);
        const y = h - pad - barH;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            rx="4"
            width={bw}
            height={barH}
            fill="url(#barG2)"
          />
        );
      })}
    </svg>
  );
}

function PieChart({
  values = [],
  colors = [],
  size = 120,
  donut = false,
  inner = 36,
}) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let angle = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {values.map((v, i) => {
        const start = angle;
        const portion = (v / total) * 360;
        const end = start + portion;
        angle = end;
        const path = pieSlicePath(size / 2, size / 2, size / 2 - 2, start, end);
        return (
          <path
            key={i}
            d={path}
            fill={colors[i % colors.length]}
            stroke="var(--card)"
            strokeWidth="0.5"
          />
        );
      })}
      {donut && (
        <circle cx={size / 2} cy={size / 2} r={inner} fill="var(--card)" />
      )}
      {donut && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="6"
          fontSize="13"
          fill="var(--text)"
          fontWeight="700"
        >
          {Math.round((values[0] / total) * 100)}%
        </text>
      )}
    </svg>
  );
}

function RadarChart({ axes = [], values = [], size = 180 }) {
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 18;
  const step = 360 / (axes.length || 1);
  const max = Math.max(...values, 1);
  const axisPts = axes.map((_, i) => polarToCartesian(cx, cy, r, i * step));
  const valuePts = values.map((v, i) =>
    polarToCartesian(cx, cy, (v / max) * r, i * step)
  );
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`}>
      {axisPts.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p[0]}
          y2={p[1]}
          stroke="var(--border)"
          strokeWidth="0.8"
        />
      ))}
      <polygon
        points={axisPts.map((p) => p.join(",")).join(" ")}
        fill="transparent"
        stroke="var(--border)"
        strokeWidth="0.6"
      />
      <polygon
        points={valuePts.map((p) => p.join(",")).join(" ")}
        fill="var(--accentGreen)"
        fillOpacity="0.14"
        stroke="var(--accentGreen)"
        strokeWidth="1.2"
      />
      {axes.map((a, i) => {
        const label = polarToCartesian(cx, cy, r + 14, i * step);
        return (
          <text
            key={i}
            x={label[0]}
            y={label[1]}
            fontSize="11"
            fill="var(--subtext)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {" "}
            {a}{" "}
          </text>
        );
      })}
    </svg>
  );
}

// ----------------- Dashboard component -----------------
export default function Dashboard({ theme, setTheme }) {
  const palette =
    theme === "dark"
      ? { ...darkColors, ...darkAccents }
      : { ...lightColors, ...lightAccents };

  const cssVars = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(palette).map(([key, value]) => [`--${key}`, value])
      ),
    [palette]
  );

  // Section Header Styles
  const sectionAccents = {
    line: { background: palette.gradientBlue },
    pie: { background: palette.gradientGreen },
    bar: { background: palette.gradientBlueGreen },
    radar: { background: palette.gradientGreen },
    scatter: { background: palette.gradientBlue },
    map: { background: palette.gradientBlueGreen },
  };

  // dummy data
  const weeklyTraffic = useMemo(() => [120, 160, 110, 190, 230, 210, 260], []);
  const monthlyTrend = useMemo(
    () => [20, 50, 40, 75, 60, 90, 120, 140, 130, 170, 190, 210],
    []
  );
  const categoryDistribution = useMemo(() => [35, 20, 15, 10, 8, 12], []);
  const sourcesCred = useMemo(() => [95, 82, 76, 63, 40], []);
  const radarAxes = useMemo(
    () => ["Clarity", "Tone", "Correctness", "Originality", "SourceQuality"],
    []
  );
  const radarVals = useMemo(() => [80, 60, 35, 50, 70], []);
  const bubbleData = useMemo(
    () => [
      { x: 20, y: 40, r: 12 },
      { x: 40, y: 70, r: 18 },
      { x: 60, y: 30, r: 9 },
      { x: 80, y: 85, r: 22 },
      { x: 100, y: 50, r: 14 },
    ],
    []
  );
  const scatterData = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        x: i,
        y: Math.round(20 + Math.random() * 160),
      })),
    []
  );
  const polarValues = useMemo(() => [40, 70, 30, 50, 80, 60], []);
  const mixedBar = useMemo(() => [30, 50, 60, 40, 80, 70, 90], []);
  const mixedLine = useMemo(() => [20, 55, 45, 60, 50, 85, 100], []);

  const categoryTotal = useMemo(
    () => categoryDistribution.reduce((a, b) => a + b, 0) || 1,
    [categoryDistribution]
  );

  return (
    <div
      className="min-h-screen"
      style={{ ...cssVars, background: "var(--bg)" }}
    >
      <Header theme={theme} setTheme={setTheme} />
      <div className="max-w-7xl mx-auto mt-6 px-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left side */}
          <div className="col-span-12 lg:col-span-6 space-y-4 lg:space-y-6">
            {/* Line & Area Section */}
            <section
              className="rounded-3xl border"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                boxShadow:
                  theme === "dark"
                    ? "0 6px 30px rgba(0,0,0,0.4)"
                    : "0 6px 20px rgba(15,23,42,0.04)",
              }}
            >
              <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg"
                    style={sectionAccents.line}
                  />
                  <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>
                      {" "}
                      Line & Area{" "}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--subtext)" }}
                    >
                      {" "}
                      Trends & infographics{" "}
                    </div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  Volume{" "}
                </div>
              </div>

              <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Weekly Traffic{" "}
                  </div>
                  <LineChart data={weeklyTraffic} />
                </div>
                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Infographic (Area){" "}
                  </div>
                  <AreaChart data={monthlyTrend} />
                </div>
              </div>
            </section>

            {/* Pie / Donut Section */}
            <section
              className="rounded-3xl border"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                boxShadow:
                  theme === "dark"
                    ? "0 6px 30px rgba(0,0,0,0.45)"
                    : "0 6px 20px rgba(15,23,42,0.03)",
              }}
            >
              <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg"
                    style={sectionAccents.pie}
                  />
                  <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>
                      {" "}
                      Pie & Donut{" "}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--subtext)" }}
                    >
                      {" "}
                      Category distribution{" "}
                    </div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  Proportion{" "}
                </div>
              </div>

              <div className="p-2 sm:p-4 flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-4">
                <div className="flex-shrink-0">
                  <PieChart
                    values={categoryDistribution}
                    colors={palette.palette}
                    size={120}
                    donut
                    inner={30}
                  />
                </div>
                <div className="w-full flex-1">
                  {["Health", "Politics", "Scam", "Adult", "Spam", "Other"].map(
                    (label, i) => {
                      const pct =
                        Math.round(
                          (categoryDistribution[i] / categoryTotal) * 100
                        ) || 0;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-sm"
                              style={{
                                background:
                                  palette.palette[i % palette.palette.length],
                              }}
                            />
                            <div style={{ color: "var(--text)" }}>{label}</div>
                          </div>
                          <div style={{ color: "var(--subtext)" }}>{pct}%</div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* Bar & Mixed Section */}
            <section
              className="rounded-3xl border"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                boxShadow:
                  theme === "dark"
                    ? "0 10px 40px rgba(0,0,0,0.5)"
                    : "0 6px 20px rgba(15,23,42,0.03)",
              }}
            >
              <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg"
                    style={sectionAccents.bar}
                  />
                  <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>
                      {" "}
                      Bar & Mixed{" "}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--subtext)" }}
                    >
                      {" "}
                      Volume & overlay metrics{" "}
                    </div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  Monthly{" "}
                </div>
              </div>

              <div className="p-2 sm:p-4">
                <div className="mb-4">
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Monthly — Volume & Credibility{" "}
                  </div>
                  <div style={{ width: "100%", height: 220 }}>
                    <svg
                      width="100%"
                      viewBox="0 0 700 220"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <linearGradient id="mbar2" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="var(--barSecondary)" />
                          <stop offset="100%" stopColor="var(--barPrimary)" />
                        </linearGradient>
                      </defs>
                      {mixedBar.map((v, i) => {
                        const w = 700,
                          h = 160,
                          pad = 40;
                        const bw = (w - pad * 2) / mixedBar.length - 8;
                        const max = Math.max(...mixedBar);
                        const barH = (v / max) * h;
                        const x = pad + i * (bw + 8);
                        const y = 220 - pad - barH;
                        return (
                          <rect
                            key={i}
                            x={x}
                            y={y}
                            width={bw}
                            height={barH}
                            rx="3"
                            fill="url(#mbar2)"
                          />
                        );
                      })}
                      {(() => {
                        const w = 700,
                          pad = 40,
                          h = 160;
                        const pts = mixedLine.map((v, i) => {
                          const x =
                            pad + i * ((w - pad * 2) / (mixedLine.length - 1));
                          const y =
                            220 - pad - (v / Math.max(...mixedLine)) * h;
                          return [x, y];
                        });
                        return (
                          <path
                            d={pointsToPath(pts)}
                            fill="none"
                            stroke="var(--accentBlue)"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div
                    className="rounded-xl p-2 sm:p-3"
                    style={{
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(15,23,42,0.02)",
                    }}
                  >
                    <div
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--text)" }}
                    >
                      {" "}
                      Volume (Bar){" "}
                    </div>
                    <BarChart data={[120, 90, 140, 80, 160, 130, 100]} />
                  </div>
                  <div
                    className="rounded-xl p-2 sm:p-3"
                    style={{
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(15,23,42,0.02)",
                    }}
                  >
                    <div
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--text)" }}
                    >
                      {" "}
                      Mini spark{" "}
                    </div>
                    <Sparkline data={[50, 70, 60, 90, 80, 100, 95]} />
                  </div>
                </div>
              </div>
            </section>

            {/* Radar & Polar */}
            <section
              className="rounded-3xl border"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg"
                    style={sectionAccents.radar}
                  />
                  <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>
                      {" "}
                      Radar & Polar{" "}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--subtext)" }}
                    >
                      {" "}
                      Multi-axis & radial{" "}
                    </div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  Profile{" "}
                </div>
              </div>

              <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Profile Radar{" "}
                  </div>
                  <RadarChart axes={radarAxes} values={radarVals} size={160} />
                </div>
                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Polar area{" "}
                  </div>
                  <svg width="100%" viewBox="0 0 200 200">
                    <g transform="translate(100,100)">
                      {polarValues.map((v, i) => {
                        const start = (i / polarValues.length) * 360;
                        const end = ((i + 1) / polarValues.length) * 360;
                        const r = 20 + (v / 100) * 60;
                        const p = pieSlicePath(0, 0, r, start, end);
                        return (
                          <path
                            key={i}
                            d={p}
                            fill={palette.palette[i % palette.palette.length]}
                            stroke="var(--card)"
                            strokeWidth="0.6"
                          />
                        );
                      })}
                    </g>
                  </svg>
                </div>
                <div className="rounded-xl p-2 sm:p-3 md:col-span-2 lg:col-span-1">
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Notes{" "}
                  </div>
                  <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    {" "}
                    Radar shows multiple metrics at a glance. Polar area
                    showcases relative category magnitudes.{" "}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right side */}
          <div className="col-span-12 lg:col-span-6 space-y-4 lg:space-y-6">
            {/* Map card */}
            <section
              className="rounded-3xl border overflow-hidden"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <div
                className="px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="w-10 h-10 rounded-lg"
                  style={sectionAccents.map}
                />
                <div>
                  <div className="font-bold" style={{ color: "var(--text)" }}>
                    {" "}
                    Geographic View{" "}
                  </div>
                  <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    {" "}
                    Interactive map of reported items{" "}
                  </div>
                </div>
              </div>
              <div className="w-full h-80 md:h-96 relative">
                <Graph theme={theme} />
              </div>
              <div className="p-2 sm:p-4 grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    {" "}
                    Top Regions{" "}
                  </div>
                  <div
                    className="mt-2 text-sm sm:text-base font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Mumbai • Delhi • Bengaluru{" "}
                  </div>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    {" "}
                    Avg Response Time{" "}
                  </div>
                  <div
                    className="mt-2 text-sm sm:text-base font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    2.4 hrs{" "}
                  </div>
                </div>
              </div>
            </section>

            {/* Sources & credibility */}
            <section
              className="rounded-3xl border p-3 sm:p-4"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold" style={{ color: "var(--text)" }}>
                  {" "}
                  Sources & Credibility{" "}
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  {sourcesCred.length} sources{" "}
                </div>
              </div>
              <div className="space-y-3">
                {sourcesCred.map((s, i) => {
                  const pct = clamp(s, 0, 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-sm">
                          <div
                            className="font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {" "}
                            Source {i + 1}{" "}
                          </div>
                          <div style={{ color: "var(--subtext)" }}>{pct}%</div>
                        </div>
                        <div
                          className="h-2 w-full rounded-full overflow-hidden mt-2"
                          style={{ background: "var(--border)" }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: "var(--gradientBlueGreen)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick actions */}
            <section
              className="rounded-3xl border p-3 sm:p-4"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold" style={{ color: "var(--text)" }}>
                  {" "}
                  Quick Actions{" "}
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  Policy tools{" "}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  className="px-4 py-2 rounded-xl text-left text-sm"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {" "}
                  Bulk review flagged (120){" "}
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-left text-sm"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {" "}
                  Export suspicious content{" "}
                </button>
                <button
                  className="px-4 py-2 rounded-xl text-left text-sm font-semibold"
                  style={{ background: "var(--accentBlue)", color: "white" }}
                >
                  {" "}
                  Open case manager{" "}
                </button>
              </div>
            </section>

            {/* Scatter & Bubble */}
            <section
              className="rounded-3xl border"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
              }}
            >
              <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-lg"
                    style={sectionAccents.scatter}
                  />
                  <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>
                      {" "}
                      Scatter & Bubble{" "}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--subtext)" }}
                    >
                      {" "}
                      Outliers & clusters{" "}
                    </div>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                  {" "}
                  Dispersion{" "}
                </div>
              </div>

              <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Scatter — hourly{" "}
                  </div>
                  <svg width="100%" viewBox="0 0 400 160">
                    <rect width="100%" height="100%" fill="transparent" />
                    {scatterData.map((s, i) => {
                      const x = (s.x / 23) * 360 + 20;
                      const y = 150 - clamp(s.y, 0, 200);
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={3 + (i % 3)}
                          fill="var(--accentBlue)"
                          fillOpacity="0.9"
                        />
                      );
                    })}
                  </svg>
                </div>

                <div
                  className="rounded-xl p-2 sm:p-3"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    {" "}
                    Bubble — severity vs reach{" "}
                  </div>
                  <svg width="100%" viewBox="0 0 220 140">
                    <rect
                      x="0"
                      y="0"
                      width="220"
                      height="140"
                      fill="transparent"
                    />
                    {bubbleData.map((b, i) => {
                      const x = (b.x / 110) * 200 + 10;
                      const y = 140 - (b.y / 110) * 120;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={b.r}
                          fill={palette.palette[i % palette.palette.length]}
                          fillOpacity="0.92"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="py-6 sm:py-10">
          <div
            className="max-w-6xl mx-auto px-4 text-sm text-center"
            style={{ color: "var(--subtext)" }}
          >
            {" "}
            WhiteBrains Misinformation Combater @2025{" "}
          </div>
        </footer>
      </div>
    </div>
  );
}
