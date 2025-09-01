import React from "react";
import Graph from "../Graph2";
import { Link } from "react-router-dom";

// Import the new icons we'll use
import {
  IoGlobeOutline,
  IoLocationOutline,
  IoTimerOutline,
  IoMove, // A clear icon for the drag handle
} from "react-icons/io5";

export default function MapCard({
  theme,
  sectionAccents,
  dragListeners,
  isDragging = false,
}) {
  return (
    <section
      className="rounded-3xl border overflow-hidden flex flex-col"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      }}
    >
      {/* --- HEADER --- */}
      <div
        className="px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center gap-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex gap-3 items-center">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={sectionAccents.map}
          >
            <IoGlobeOutline
              className="h-6 w-6"
              style={{ color: "var(--primary-foreground, white)" }}
            />
          </span>
          <div>
            <div className="font-bold" style={{ color: "var(--text)" }}>
              Geographic View
            </div>
            <div className="text-xs" style={{ color: "var(--subtext)" }}>
              Interactive map of reports
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/view-reports"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.75rem",
              color: "var(--buttonText)",
              padding: "6px 12px",
              background: "var(--accentBlue)",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View More
          </Link>
          {/* UPDATED: Dedicated drag handle */}
          <div
            {...dragListeners}
            style={{ cursor: "grab", color: "var(--subtext)", padding: "8px" }}
            className="active:cursor-grabbing"
          >
            <IoMove className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* --- MAP/GRAPH AREA (No changes here, the logic is great) --- */}
      <div className="w-full h-80 md:h-96 relative">
        {isDragging ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-500/10">
            <div style={{ color: "var(--subtext)" }}>Map Preview</div>
          </div>
        ) : (
          <Graph theme={theme} />
        )}
      </div>

      {/* --- FOOTER (Drag listeners removed for clarity) --- */}
      <div
        className="p-2 sm:p-4 grid grid-cols-2 gap-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(120, 140, 170, 0.05)" }}
        >
          {/* UPDATED: Added icon */}
          <div
            className="text-xs flex items-center gap-2"
            style={{ color: "var(--subtext)" }}
          >
            <IoLocationOutline />
            Top Regions
          </div>
          <div
            className="mt-2 text-sm sm:text-base font-semibold"
            style={{ color: "var(--text)" }}
          >
            Mumbai • Delhi • Bengaluru
          </div>
        </div>
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(120, 140, 170, 0.05)" }}
        >
          {/* UPDATED: Added icon */}
          <div
            className="text-xs flex items-center gap-2"
            style={{ color: "var(--subtext)" }}
          >
            <IoTimerOutline />
            Avg Response Time
          </div>
          <div
            className="mt-2 text-sm sm:text-base font-semibold"
            style={{ color: "var(--text)" }}
          >
            2.4 hrs
          </div>
        </div>
      </div>
    </section>
  );
}
