import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

// --- Helper Functions ---
const formatTimestamp = (isoString) => {
  if (!isoString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(isoString));
};

const getCredibilityStyle = (score) => {
  if (score >= 80)
    return { color: "#22c55e", text: `🟢 Credibility: ${score}` }; // green-500
  if (score >= 40)
    return { color: "#f97316", text: `🟡 Credibility: ${score}` }; // orange-500
  return { color: "#ef4444", text: `🔴 Credibility: ${score}` }; // red-500
};

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

// --- Skeleton Loader Component for better UX ---
const SkeletonReportCard = () => (
  <div
    style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
      opacity: 0.5,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          height: "20px",
          width: "120px",
          background: "var(--border)",
          borderRadius: "12px",
        }}
      ></div>
      <div
        style={{
          height: "20px",
          width: "100px",
          background: "var(--border)",
          borderRadius: "12px",
        }}
      ></div>
    </div>
    <div
      style={{
        height: "16px",
        background: "var(--border)",
        borderRadius: "4px",
        marginBottom: "8px",
      }}
    ></div>
    <div
      style={{
        height: "16px",
        width: "80%",
        background: "var(--border)",
        borderRadius: "4px",
        marginBottom: "12px",
      }}
    ></div>
    <div
      style={{
        height: "14px",
        width: "150px",
        background: "var(--border)",
        borderRadius: "4px",
      }}
    ></div>
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
    { value: "day", label: "Past Day" },
    { value: "2days", label: "Past 2 Days" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "all", label: "All Time" },
  ];

  const availableStates = useMemo(() => {
    const states = new Set(reports.map((r) => r.location.state));
    return ["All", ...Array.from(states).sort()];
  }, [reports]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_URL}/api/v1/dashboard/recentReports`
        );
        setReports(response.data);
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
        filters.state === "All" || report.location.state === filters.state;
      const dateMatch = !startDate || new Date(report.timestamp) >= startDate;
      return stateMatch && dateMatch;
    });
    return filtered.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [reports, filters]);

  return (
    <div
      style={{
        ...cssVars,
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "24px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <Link
              to="/dashboard"
              style={{
                color: "var(--accentBlue)",
                textDecoration: "none",
                marginBottom: "8px",
                display: "inline-block",
              }}
            >
              &larr; Back to Dashboard
            </Link>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", margin: 0 }}>
              Misinformation Reports
            </h1>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: "var(--border)",
              border: "none",
              borderRadius: "100%",
              padding: "10px",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--text)" }}
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--text)" }}
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </header>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "32px",
            padding: "16px",
            background: "var(--card)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.9rem", color: "var(--subtext)" }}>
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) =>
                setFilters({ ...filters, state: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "var(--bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                marginTop: "4px",
                // --- Style Updates for Custom Arrow ---
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              {availableStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {/* Duration Dropdown */}
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.9rem", color: "var(--subtext)" }}>
              Duration
            </label>
            <select
              value={filters.duration}
              onChange={(e) =>
                setFilters({ ...filters, duration: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "var(--bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                marginTop: "4px",
                // --- Style Updates for Custom Arrow ---
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonReportCard key={i} />
            ))}
          {error && (
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "48px",
                textAlign: "center",
                color: "#ef4444",
              }}
            >
              <p>Error: {error}</p>
            </div>
          )}
          {!isLoading &&
            !error &&
            (filteredAndSortedReports.length > 0 ? (
              filteredAndSortedReports.map((report) => {
                const credibility = getCredibilityStyle(
                  report.credibility_score
                );
                return (
                  <div
                    key={report.timestamp}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "16px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        fontSize: "0.9em",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "var(--border)",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          color: "var(--subtext)",
                        }}
                      >
                        {report.category}
                      </span>
                      <span
                        style={{ color: credibility.color, fontWeight: "bold" }}
                      >
                        {credibility.text}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 12px 0", lineHeight: 1.6 }}>
                      {report.report_summary}
                    </p>
                    <div
                      style={{ fontSize: "0.85em", color: "var(--subtext)" }}
                    >
                      <span>{formatTimestamp(report.timestamp)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "48px",
                  textAlign: "center",
                  color: "var(--subtext)",
                }}
              >
                <p>No reports found for the selected filters.</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
