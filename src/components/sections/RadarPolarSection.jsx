import React, { useState, useEffect } from "react";
import RadarChart from "../charts/RadarChart";
import axios from "axios";

export default function RadarPolarSection({ theme, sectionAccents }) {
    const [sources, setSources] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE = import.meta.env.VITE_API_URL || "";
    const API_URL = `${BASE}/api/v1/trends/radar`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                let fetched = response?.data || {};
                setSources(fetched);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    // Safeguard to avoid errors when sources is empty
    const radarAxes = Object.keys(sources).length ? Object.keys(sources) : ["Clarity", "Tone", "Correctness", "Originality", "SourceQuality"];
    const radarVals = Object.keys(sources).length ? Object.values(sources) : [100, 60, 35, 50, 70];

    console.log("Radar Data:", sources);

    return (
        <section
            className="rounded-3xl border"
            style={{
                borderColor: "var(--border)",
                background: "var(--card)",
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
            >
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg" style={sectionAccents.radar} />
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>
                            Scores Radial Chart
                        </div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>
                            Multi-axis & radial
                        </div>
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>Profile</div>
            </div>

            {/* Body */}
            <div className="sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
    {/* Radar Chart Container */}
    <div
        className="rounded-xl flex justify-center items-center md:col-span-1 lg:col-span-2"
        style={{
            background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)",
        }}
    >
        <div className="w-full max-w-[480px] flex flex-col items-center">
            <div className="text-sm font-semibold mb-2 py-3" style={{ color: "var(--text)" }}>
                Profile Radar
            </div>
            <RadarChart
                axes={radarAxes}
                values={radarVals}
                size={Math.min(window.innerWidth * 0.3, 260)} // responsive, max 260px
            />
        </div>
    </div>

    {/* Notes Section */}
    <div className="rounded-xl p-2 sm:p-3 md:col-span-1 lg:col-span-1">
        <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Notes</div>
        <div className="text-xs" style={{ color: "var(--subtext)" }}>
            Radar shows multiple metrics at a glance. Polar area showcases relative category magnitudes.
        </div>
    </div>
</div>

        </section>
    );
}
