import React from "react";
import LineChart from "../charts/LineChart";
import AreaChart from "../charts/AreaChart";

export default function LineAreaSection({ weeklyTraffic, monthlyTrend, theme, palette, sectionAccents }) {
    return (
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
                    <span className="w-10 h-10 rounded-lg" style={sectionAccents.line} />
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>
                            Line & Area
                        </div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>
                            Trends & infographics
                        </div>
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    Volume
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
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                        Weekly Traffic
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
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                        Infographic (Area)
                    </div>
                    <AreaChart data={monthlyTrend} />
                </div>
            </div>
        </section>
    );
}
