import { useState, useEffect } from "react";
import axios from "axios";

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

function PieChart({ values = [], colors = [], size = 120, donut = false, inner = 36 }) {
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
            {donut && values.length > 0 && (
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

export default function PieSection({ theme, sectionAccents, palette }) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE = import.meta.env.VITE_API_URL || "";
    const API_URL = `${BASE}/api/v1/dashboard/categories`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                setData(response.data);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    // convert object → entries
    const entries = Object.entries(data);

    // sort by count, excluding "None" from ranking
    const sorted = entries
        .filter(([key]) => key !== "Other" || k !== "None")
        .sort((a, b) => b[1] - a[1]);

    // top 5 + remainder
    const top5 = sorted.slice(0, 5);
    const remainder = sorted.slice(5);

    // include "None" in remainder
    if (data["None"]) {
        remainder.push(["None", data["None"]]);
    }

    // merge remainder counts into one slice
    const remainderTotal = remainder.reduce((acc, [_, v]) => acc + v, 0);

    // final chart data (6 slices max)
    const chartEntries = [...top5, ["Others", remainderTotal]];
    const chartKeys = chartEntries.map(([k]) => k);
    const chartValues = chartEntries.map(([_, v]) => v);

    const categoryTotal = chartValues.reduce((a, b) => a + b, 0) || 1;

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
                            Pie & Donut
                        </div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>
                            Category distribution
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
                        colors={palette.palette.slice(0, 6)} // ensure 6 colors
                        size={120}
                        donut
                        inner={30}
                    />
                </div>
                <div className="w-full flex-1">
                    {chartKeys.map((label, i) => {
                        const pct = Math.round((chartValues[i] / categoryTotal) * 100) || 0;
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
                    })}
                </div>
            </div>
        </section>
    );
}
