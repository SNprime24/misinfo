import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  IoMapOutline,
  IoTimeOutline,
  IoChevronDown,
  IoLinkOutline,
  IoSadOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import config from "../config.js";
import ReportCard from "../components/ReportCard.jsx";

const API_URL = config.API_URL || "http://127.0.0.1:8000";

// --- Color Palettes ---
const darkColors = {
  bg: "rgb(10,12,20)",
  card: "rgb(18, 32, 58)",
  border: "rgb(30, 48, 80)",
  text: "rgb(200, 220, 255)",
  subtext: "rgb(120, 140, 170)",
  accentBlue: "rgb(6, 165, 225)",
};
const lightColors = {
  bg: "rgb(248, 250, 252)",
  card: "rgb(255, 255, 255)",
  text: "rgb(15, 23, 42)",
  subtext: "rgb(100, 116, 139)",
  border: "rgb(226, 232, 240)",
  accentBlue: "rgb(0, 110, 255)",
};

// --- Reusable Components (moved outside main component) ---

const FilterDropdown = ({ label, icon, value, onChange, options }) => (
  <div className="flex-1">
    <label
      className="text-sm font-medium flex items-center gap-2"
      style={{ color: "var(--subtext)" }}
    >
      {icon}
      {label}
    </label>
    <div className="relative mt-1">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none cursor-pointer rounded-lg border bg-transparent py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card)] focus:ring-[var(--accentBlue)]"
        style={{ color: "var(--text)", borderColor: "var(--border)" }}
      >
        {options.map((opt) => (
          <option
            key={opt.value || opt}
            value={opt.value || opt}
            style={{ backgroundColor: "var(--card)", color: "var(--text)" }}
          >
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
        style={{ color: "var(--subtext)" }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

const SkeletonReportCard = () => (
  <div
    className="w-full animate-pulse rounded-2xl border p-5 mb-4"
    style={{ background: "var(--card)", borderColor: "var(--border)" }}
  >
    <div className="flex justify-between items-center mb-4">
      <div
        className="h-6 w-1/3 rounded-md"
        style={{ background: "var(--border)" }}
      ></div>
      <div
        className="h-6 w-1/4 rounded-md"
        style={{ background: "var(--border)" }}
      ></div>
    </div>
    <div
      className="h-4 w-full rounded-md mb-2"
      style={{ background: "var(--border)" }}
    ></div>
    <div
      className="h-4 w-3/4 rounded-md mb-4"
      style={{ background: "var(--border)" }}
    ></div>
    <div className="flex justify-between">
      <div
        className="h-3 w-1/3 rounded-md"
        style={{ background: "var(--border)" }}
      ></div>
      <div
        className="h-3 w-1/4 rounded-md"
        style={{ background: "var(--border)" }}
      ></div>
    </div>
  </div>
);

const MetricBar = ({ label, score }) => (
  <div>
    <div className="flex justify-between items-center text-xs mb-1">
      <span style={{ color: "var(--text)" }}>{label}</span>
      <span className="font-medium" style={{ color: "var(--subtext)" }}>
        {score}%
      </span>
    </div>
    <div
      className="h-2 w-full rounded-full overflow-hidden"
      style={{ background: "var(--border)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${score}%`,
          background: score > 50 ? "var(--accentBlue)" : "#f59e0b",
        }}
      />
    </div>
  </div>
);

// --- Main Page Component ---
const ReportsPage = ({ theme, setTheme }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ state: "All", duration: "all" });

  const palette = theme === "dark" ? darkColors : lightColors;
  const cssVars = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(palette).map(([key, value]) => [`--${key}`, value])
      ),
    [palette]
  );

  const durationOptions = [
    { value: "all", label: "All Time" },
    { value: "month", label: "Past Month" },
    { value: "week", label: "Past Week" },
    { value: "2days", label: "Past 2 Days" },
    { value: "day", label: "Past Day" },
  ];

  const availableStates = useMemo(() => {
    if (isLoading) return ["All"];
    const states = new Set(reports.map((r) => r.state).filter(Boolean));
    return ["All", ...Array.from(states).sort()];
  }, [reports, isLoading]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/dashboard/recentReports`
        );
        const reportsWithIds = (response.data || []).map((report, index) => ({
          ...report,
          id: report.timestamp + index,
        }));
        setReports(reportsWithIds);
      } catch (err) {
        setError("Could not load recent reports. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredAndSortedReports = useMemo(() => {
    if (!reports) return [];
    let startDate = null;
    if (filters.duration !== "all") {
      startDate = new Date();
      switch (filters.duration) {
        case "day":
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "2days":
          startDate.setDate(startDate.getDate() - 2);
          break;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate = null;
      }
    }
    const filtered = reports.filter((report) => {
      const stateMatch =
        filters.state === "All" || report.state === filters.state;
      const dateMatch = !startDate || new Date(report.timestamp) >= startDate;
      return stateMatch && dateMatch;
    });
    return filtered.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [reports, filters]);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ ...cssVars, background: "var(--bg)", color: "var(--text)" }}
    >
      <Header theme={theme} setTheme={setTheme} />
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <Link
              to="/dashboard"
              className="text-sm mb-2 inline-block"
              style={{ color: "var(--accentBlue)" }}
            >
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">
              Misinformation Reports
            </h1>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row gap-4 mb-8 p-4 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <FilterDropdown
            label="Filter by State"
            icon={<IoMapOutline />}
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            options={availableStates}
          />
          <FilterDropdown
            label="Filter by Duration"
            icon={<IoTimeOutline />}
            value={filters.duration}
            onChange={(e) =>
              setFilters({ ...filters, duration: e.target.value })
            }
            options={durationOptions}
          />
        </div>

        <div className="space-y-4">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonReportCard key={i} />
            ))}
          {error && (
            <div
              className="text-center p-12 rounded-2xl border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}
          {!isLoading &&
            !error &&
            (filteredAndSortedReports.length > 0 ? (
              filteredAndSortedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            ) : (
              <div
                className="text-center p-12 rounded-2xl border flex flex-col items-center gap-4"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <IoSadOutline size={40} style={{ color: "var(--subtext)" }} />
                <p>No reports found for the selected filters.</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
