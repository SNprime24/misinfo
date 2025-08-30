import React, { useState, useEffect } from "react";
import { clamp } from "../charts/chartUtils";
import axios from "axios";

export default function SourcesCredibility({ palette }) {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE = import.meta.env.VITE_API_URL || "";
    const API_URL = `${BASE}/api/v1/trends/sources`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                let fetched = response.data?.top_sources || [];
                fetched.sort((a, b) => b.percentage - a.percentage);
                setSources(fetched);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const topSources = sources.slice(0, 5);
    const remainingCount = sources.length - topSources.length;

    return (
        <section
            className="rounded-3xl border p-3 sm:p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="font-bold" style={{ color: "var(--text)" }}>
                    Credible Sources
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    {sources.length} sources
                </div>
            </div>
            <div className="space-y-3">
                {topSources.map((src, i) => {
                    const pct = clamp(src.percentage, 0, 100);
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between text-sm">
                                    <div
                                        className="font-semibold truncate"
                                        style={{ color: "var(--text)" }}
                                    >
                                        {src.domain || "Unknown"}
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
                {remainingCount > 0 && (
                    <div className="text-xs text-right" style={{ color: "var(--subtext)" }}>
                        +{remainingCount} more
                    </div>
                )}
            </div>
        </section>
    );
}
