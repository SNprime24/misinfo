import React, { useMemo } from "react";
import Header from "../components/Header";
import Graph from "../components/Graph"; // existing
// charts/sections
import LineAreaSection from "../components/sections/LineAreaSection";
import PieSection from "../components/sections/PieSection";
import BarMixedSection from "../components/sections/BarMixedSection";
import RadarPolarSection from "../components/sections/RadarPolarSection";
import MapCard from "../components/sections/MapCard";
import SourcesCredibility from "../components/sections/SourcesCredibility";
import QuickActions from "../components/sections/QuickActions";
import ScatterBubbleSection from "../components/sections/ScatterBubbleSection";

// ----------------- Color Palettes -----------------
const darkColors = {
  bg: "rgb(11, 22, 44)",
  card: "rgb(18, 32, 58)",
  border: "rgb(30, 48, 80)",
  text: "rgb(200, 220, 255)",
  subtext: "rgb(120, 140, 170)",
  accentBlue: "rgb(6, 165, 225)",
  midBlue: "rgb(50, 110, 220)",
  darkBlue: "rgb(10, 40, 120)",
  accentGreen: "rgb(0, 255, 135)",
  midGreen: "rgb(50, 200, 100)",
  darkGreen: "rgb(0, 150, 70)",
};

const darkAccents = {
  gradientBlueGreen: "linear-gradient(to right, rgb(6, 165, 225), rgb(0, 255, 135))",
  gradientBlue: "linear-gradient(to top, rgb(50, 110, 220), rgb(6, 165, 225))",
  gradientGreen: "linear-gradient(to top, rgb(50, 200, 100), rgb(0, 255, 135))",
  line: "rgb(6, 165, 225)",
  barPrimary: "rgb(0, 255, 135)",
  barSecondary: "rgb(50, 110, 220)",
  mapPin: "rgb(0, 255, 135)",
  highlight: "rgb(6, 165, 225)",
  palette: [
    darkColors.accentBlue,
    darkColors.accentGreen,
    "rgb(124, 58, 237)",
    darkColors.midBlue,
    darkColors.midGreen,
    "rgb(249, 115, 22)",
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
  gradientBlueGreen: `linear-gradient(to right, ${lightColors.accent}, #10b981)`,
  gradientBlue: `linear-gradient(to top, ${lightColors.midBlue}, ${lightColors.accent})`,
  gradientGreen: "linear-gradient(to top, #34d399, #10b981)",
  line: lightColors.accent,
  barPrimary: "#10b981",
  barSecondary: lightColors.midBlue,
  mapPin: "#10b981",
  highlight: lightColors.accent,
  palette: ["#0ea5e9", "#10b981", "#7c3aed", "#3b82f6", "#f59e0b", "#ef4444"],
};

// ----------------- Dashboard -----------------
export default function Dashboard({ theme, setTheme }) {
  const palette = theme === "dark" ? { ...darkColors, ...darkAccents } : { ...lightColors, ...lightAccents };

  const cssVars = useMemo(
    () =>
      Object.fromEntries(Object.entries(palette).map(([key, value]) => [`--${key}`, value])),
    [palette]
  );

  // Section accents
  const sectionAccents = {
    line: { background: palette.gradientBlue },
    pie: { background: palette.gradientGreen },
    bar: { background: palette.gradientBlueGreen },
    radar: { background: palette.gradientGreen },
    scatter: { background: palette.gradientBlue },
    map: { background: palette.gradientBlueGreen },
  };

  // dummy data (same as before)
  const weeklyTraffic = useMemo(() => [120, 160, 110, 190, 230, 210, 260], []);
  const monthlyTrend = useMemo(() => [20, 50, 40, 75, 60, 90, 120, 140, 130, 170, 190, 210], []);
  const sourcesCred = useMemo(() => [95, 82, 76, 63, 40], []);
  const radarAxes = useMemo(() => ["Clarity", "Tone", "Correctness", "Originality", "SourceQuality"], []);
  const radarVals = useMemo(() => [80, 60, 35, 50, 70], []);
  const bubbleData = useMemo(() => [
    { x: 20, y: 40, r: 12 },
    { x: 40, y: 70, r: 18 },
    { x: 60, y: 30, r: 9 },
    { x: 80, y: 85, r: 22 },
    { x: 100, y: 50, r: 14 },
  ], []);
  const scatterData = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({ x: i, y: Math.round(20 + Math.random() * 160) })), []);
  const polarValues = useMemo(() => [40, 70, 30, 50, 80, 60], []);
  const mixedBar = useMemo(() => [30, 50, 60, 40, 80, 70, 90], []);
  const mixedLine = useMemo(() => [20, 55, 45, 60, 50, 85, 100], []);

  return (
    <div className="min-h-screen" style={{ ...cssVars, background: "var(--bg)" }}>
      <Header theme={theme} setTheme={setTheme} />
      <div className="max-w-7xl mx-auto mt-6 px-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left side */}
          <div className="col-span-12 lg:col-span-6 space-y-4 lg:space-y-6">
            <LineAreaSection weeklyTraffic={weeklyTraffic} monthlyTrend={monthlyTrend} theme={theme} palette={palette} sectionAccents={sectionAccents} />
            <PieSection theme={theme} sectionAccents={sectionAccents} palette={palette} />
            <BarMixedSection mixedBar={mixedBar} mixedLine={mixedLine} theme={theme} sectionAccents={sectionAccents} />
            <RadarPolarSection radarAxes={radarAxes} radarVals={radarVals} polarValues={polarValues} palette={palette} theme={theme} sectionAccents={sectionAccents} />
          </div>

          {/* Right side */}
          <div className="col-span-12 lg:col-span-6 space-y-4 lg:space-y-6">
            <MapCard theme={theme} sectionAccents={sectionAccents} />
            <SourcesCredibility sourcesCred={sourcesCred} palette={palette} />
            <QuickActions theme={theme} />
            <ScatterBubbleSection scatterData={scatterData} bubbleData={bubbleData} palette={palette} theme={theme} sectionAccents={sectionAccents} />
          </div>
        </div>

        <footer className="py-6 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 text-sm text-center" style={{ color: "var(--subtext)" }}>
            WhiteBrains Misinformation Combater @2025
          </div>
        </footer>
      </div>
    </div>
  );
}
