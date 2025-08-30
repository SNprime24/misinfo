import React from "react";
import Graph from "../Graph2"; // adjust path if Graph is in components root

export default function MapCard({ theme, sectionAccents }) {
    return (
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
                <span className="w-10 h-10 rounded-lg" style={sectionAccents.map} />
                <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>Geographic View</div>
                    <div className="text-xs" style={{ color: "var(--subtext)" }}>Interactive map of reported items</div>
                </div>
            </div>
            <div className="w-full h-80 md:h-96 relative">
                <Graph theme={theme} />
            </div>
            <div className="p-2 sm:p-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                    <div className="text-xs" style={{ color: "var(--subtext)" }}>Top Regions</div>
                    <div className="mt-2 text-sm sm:text-base font-semibold" style={{ color: "var(--text)" }}>Mumbai • Delhi • Bengaluru</div>
                </div>
                <div className="rounded-xl p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                    <div className="text-xs" style={{ color: "var(--subtext)" }}>Avg Response Time</div>
                    <div className="mt-2 text-sm sm:text-base font-semibold" style={{ color: "var(--text)" }}>2.4 hrs</div>
                </div>
            </div>
        </section>
    );
}
