import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// A color mapping for different misinformation categories.
const categoryColors = {
  Health: "#4CAF50",
  Political: "#2196F3",
  Financial: "#FF9800",
  Science: "#9C27B0",
  Social: "#E91E63",
  Satire: "#795548",
  None: "#9E9E9E",
  Other: "#607D8B",
  "Unreliable Information": "#FFC107", // amber
  "Out of Context": "#00BCD4", // cyan
};

// --- Helper Functions for SVG rendering ---

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

// --- Reusable PieChart Component ---

function PieChart({
  values = [],
  colors = [],
  size = 120,
  donut = false,
  inner = 36,
  donutLabel = "",
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
      {donut && donutLabel && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="6"
          fontSize="13"
          fill="var(--text)"
          fontWeight="700"
        >
          {donutLabel}
        </text>
      )}
    </svg>
  );
}

// --- Main Section Component ---

export default function PieSection({ theme, sectionAccents }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE = import.meta.env.VITE_API_URL || "";
  const API_URL = `${BASE}/api/v1/dashboard/categories`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch category data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const { chartKeys, chartValues, donutLabel, categoryTotal } = useMemo(() => {
    if (Object.keys(data).length === 0) {
      return {
        chartKeys: [],
        chartValues: [],
        donutLabel: "",
        categoryTotal: 1,
      };
    }

    // Convert data object to an array and sort by count (descending)
    const sortedEntries = Object.entries(data).sort(([, a], [, b]) => b - a);

    const keys = sortedEntries.map(([key]) => key);
    const values = sortedEntries.map(([, value]) => value);
    const total = values.reduce((a, b) => a + b, 0) || 1;

    // The label for the donut center will be the percentage of the largest category
    const label =
      values.length > 0 ? `${Math.round((values[0] / total) * 100)}%` : "";

    return {
      chartKeys: keys,
      chartValues: values,
      donutLabel: label,
      categoryTotal: total,
    };
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
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
          <span className="w-10 h-10 rounded-lg" style={sectionAccents.pie} />
          <div>
            <div className="font-bold" style={{ color: "var(--text)" }}>
              Category Breakdown
            </div>
            <div className="text-xs" style={{ color: "var(--subtext)" }}>
              Distribution from recent reports
            </div>
          </div>
        </div>
        <div className="text-xs" style={{ color: "var(--subtext)" }}>
          Proportion
        </div>
      </div>

      <div className="p-2 sm:p-4 flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-4">
        <div className="flex-shrink-0">
          <PieChart
            values={chartValues}
            colors={chartKeys.map((k) => categoryColors[k] || "#cccccc")}
            size={120}
            donut
            inner={30}
            donutLabel={donutLabel}
          />
        </div>
        <div className="w-full flex-1">
          {chartKeys.map((label, i) => {
            const pct = Math.round((chartValues[i] / categoryTotal) * 100) || 0;
            const color =
              Object.keys(categoryColors).find((key) =>
                label.toLowerCase().includes(key.toLowerCase())
              ) || "Other";

            return (
              <div
                key={i}
                className="flex items-center justify-between py-1 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-sm"
                    style={{ background: categoryColors[color] || "#cccccc" }}
                  />
                  <div style={{ color: "var(--text)" }}>{label}</div>
                </div>
                <div style={{ color: "var(--subtext)" }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
