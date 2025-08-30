import React from "react";
import MixedBarLine from "../charts/MixedBarLine";
import BarChart from "../charts/BarChart";
import Sparkline from "../charts/Sparkline";

export default function BarMixedSection({
    mixedBar,
    mixedLine,
    theme,
    sectionAccents,
}) {
    return (
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
                    <span className="w-10 h-10 rounded-lg" style={sectionAccents.bar} />
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>
                            Bar & Mixed
                        </div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>
                            Volume & overlay metrics
                        </div>
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>
                    Monthly
                </div>
            </div>

            <div className="p-2 sm:p-4">
                <div className="mb-4">
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                        Monthly — Volume & Credibility
                    </div>
                    <div style={{ width: "100%", height: 220 }}>
                        <MixedBarLine bars={mixedBar} line={mixedLine} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div className="rounded-xl p-2 sm:p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                        <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Volume (Bar)</div>
                        <BarChart data={[120, 90, 140, 80, 160, 130, 100]} />
                    </div>
                    <div className="rounded-xl p-2 sm:p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                        <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Mini spark</div>
                        <Sparkline data={[50, 70, 60, 90, 80, 100, 95]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
