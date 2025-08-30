import React from "react";
import RadarChart from "../charts/RadarChart";
import PolarChart from "../charts/PolarChart";

export default function RadarPolarSection({ radarAxes, radarVals, polarValues, palette, theme, sectionAccents }) {
    return (
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
                    <span className="w-10 h-10 rounded-lg" style={sectionAccents.radar} />
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>
                            Radar & Polar
                        </div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>
                            Multi-axis & radial
                        </div>
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>Profile</div>
            </div>

            <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                <div className="rounded-xl p-2 sm:p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Profile Radar</div>
                    <RadarChart axes={radarAxes} values={radarVals} size={160} />
                </div>
                <div className="rounded-xl p-2 sm:p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Polar area</div>
                    <PolarChart values={polarValues} palette={palette.palette} size={200} />
                </div>
                <div className="rounded-xl p-2 sm:p-3 md:col-span-2 lg:col-span-1">
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Notes</div>
                    <div className="text-xs" style={{ color: "var(--subtext)" }}>
                        Radar shows multiple metrics at a glance. Polar area showcases relative category magnitudes.
                    </div>
                </div>
            </div>
        </section>
    );
}
