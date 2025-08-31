import React from "react";
import Graph from "../Graph2"; // adjust path if Graph is in components root

// Accept the new 'isDragging' prop. It defaults to false.
export default function MapCard({ theme, sectionAccents, dragListeners, isDragging = false }) {
    return (
        <section
            className="rounded-3xl border overflow-hidden"
            style={{
                borderColor: "var(--border)",
                background: "var(--card)",
            }}
        >
            <div
                className="px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-3 border-b cursor-grab active:cursor-grabbing"
                style={{ borderColor: "var(--border)" }}
                {...dragListeners}
            >
                <span className="w-10 h-10 rounded-lg" style={sectionAccents.map} />
                <div>
                    <div className="font-bold" style={{ color: "var(--text)" }}>Geographic View</div>
                    <div className="text-xs" style={{ color: "var(--subtext)" }}>Interactive map of reported items</div>
                </div>
            </div>

            <div className="w-full h-80 md:h-96 relative">
                {/* --- THIS IS THE KEY CHANGE --- */}
                {/* If the card is being dragged, show a placeholder. Otherwise, show the live graph. */}
                {isDragging ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-500/10">
                        <div style={{ color: "var(--subtext)" }}>Map Preview</div>
                    </div>
                ) : (
                    <Graph theme={theme} />
                )}
            </div>

            <div 
                className="p-2 sm:p-4 grid grid-cols-2 gap-3 cursor-grab active:cursor-grabbing"
                {...dragListeners}
            >
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