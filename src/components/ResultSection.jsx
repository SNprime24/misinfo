import React, { useMemo, useState } from "react";
import { Download, Info, ExternalLink, Clipboard } from "lucide-react";

// robust conversion: accepts 0..1 or 0..100
function toPercent(x) {
    if (typeof x !== "number" || isNaN(x)) return 0;
    if (Math.abs(x) <= 1) return Math.max(0, Math.min(100, Math.round(x * 100)));
    return Math.max(0, Math.min(100, Math.round(x)));
}

function Progress({ value, label }) {
    const pct = toPercent(value);
    return (
        <div className="space-y-2">
            <div className="flex items-end justify-between">
                <span className="text-sm" style={{ color: "var(--subtext)" }}>{label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
            </div>
        </div>
    );
}

function EntityChip({ children }) {
    return (
        <span className="px-2 py-0.5 text-xs rounded-md border" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            {children}
        </span>
    );
}

export default function ResultSection({ score = 0, result = null, setRawOpen = () => { } }) {
    const safe = result ?? {};

    // formatted timestamp (India timezone)
    const formattedTS = useMemo(() => {
        const ts = safe.raw?.ts ?? null;
        if (!ts) return null;
        try {
            const d = new Date(ts);
            return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
        } catch {
            return new Date(ts).toString();
        }
    }, [safe.raw?.ts]);

    const [showFormal, setShowFormal] = useState(false);
    const [copied, setCopied] = useState(false);

    const downloadFormalReport = () => {
        const content = safe.formal_report || "No formal report available.";
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const copyFormalReport = async () => {
        try {
            const text = safe.formal_report || "";
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    return (
        <section className="py-10 md:py-14">
            <div className="max-w-6xl mx-auto px-4 space-y-10">

                {/* ================= Results Section ================= */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6 justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Results</h2>
                            <p className="text-sm mt-1" style={{ color: "var(--subtext)" }}>
                                Clear, educational insights designed for quick scanning.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setRawOpen(true)} className="px-3 py-2 rounded-xl border text-sm inline-flex items-center gap-2" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                                <Info size={16} /> Raw JSON
                            </button>
                        </div>
                    </div>

                    {/* Score + Summary (top row) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Score card */}
                        <div className="rounded-3xl border p-5 md:p-6 flex flex-col items-start" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <div className="w-full flex items-center justify-between">
                                <div>
                                    <div className="text-sm" style={{ color: "var(--subtext)" }}>Credibility Score</div>
                                    <div className="text-xs mt-1" style={{ color: "var(--subtext)" }}>{safe.category ?? "—"}</div>
                                </div>
                                <div className="text-sm text-right" style={{ color: "var(--subtext)" }}>
                                    {safe.key_entities?.length ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {safe.key_entities.map((k, i) => <EntityChip key={i}>{k}</EntityChip>)}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-4 w-full">
                                {/* Donut */}
                                <div className="relative grid place-items-center h-28 w-28">
                                    <svg viewBox="0 0 36 36" className="h-28 w-28">
                                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="3" />
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            fill="none"
                                            stroke="var(--accent)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray={`${toPercent(safe.credibility_score ?? score)},100`}
                                            transform="rotate(-90 18 18)"
                                        />
                                    </svg>
                                    <div className="absolute text-xl font-semibold" style={{ color: "var(--text)" }}>{toPercent(safe.credibility_score ?? score)}<span className="text-xs">%</span></div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <Progress value={safe.metrics?.clarity ?? 0} label="Clarity" />
                                    <Progress value={safe.metrics?.tone ?? 0} label="Tone" />
                                    <Progress value={safe.metrics?.correctness ?? 0} label="Correctness" />
                                    <Progress value={safe.metrics?.originality ?? 0} label="Originality" />
                                </div>
                            </div>

                            {/* metadata */}
                            <div className="mt-3 text-xs space-y-1" style={{ color: "var(--subtext)" }}>
                                {formattedTS ? <div>Analyzed: {formattedTS} (IST)</div> : <div>No timestamp</div>}
                                {safe.category && <div>Category: {safe.category}</div>}
                                {safe.subcategory && <div>Subcategory: {safe.subcategory}</div>}
                            </div>
                        </div>

                        {/* Report summary + Analysis (still inside Results) */}
                        <div className="rounded-3xl border p-5 md:p-6 md:col-span-2" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm" style={{ color: "var(--subtext)" }}>Report summary</div>
                                </div>
                                <a href="#methodology" className="text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                                    Methodology <ExternalLink size={14} />
                                </a>
                            </div>

                            <p className="mt-2 leading-relaxed" style={{ color: "var(--text)" }}>
                                {safe.report_summary ?? "Run an analysis to see a concise summary here."}
                            </p>

                            <div className="mt-4">
                                <div className="text-sm" style={{ color: "var(--subtext)" }}>Analysis</div>
                                <div className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                                    {safe.analysis ?? "No detailed analysis available."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Entities + Sources (separate row, preserved exactly) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {/* Entities */}
                        <div className="rounded-3xl border p-5 md:p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <div className="text-sm mb-2" style={{ color: "var(--subtext)" }}>Detected Entities</div>
                            <div className="space-y-2">
                                {(safe.key_entities ?? []).length === 0 && (
                                    <div className="text-sm" style={{ color: "var(--subtext)" }}>No entities yet.</div>
                                )}
                                {(safe.key_entities ?? []).map((e, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ borderColor: "var(--border)" }}>
                                        <span className="text-sm" style={{ color: "var(--text)" }}>{e}</span>
                                        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "color-mix(in oklab, var(--accent) 10%, transparent)", color: "var(--accent)" }}>entity</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sources */}
                        <div className="rounded-3xl border p-5 md:p-6 md:col-span-2" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <div className="flex items-center justify-between">
                                <div className="text-sm mb-3" style={{ color: "var(--subtext)" }}>Sources & credibility</div>
                                <div className="text-xs" style={{ color: "var(--subtext)" }}>{(safe.sources ?? []).length} source(s)</div>
                            </div>

                            <div className="space-y-3">
                                {(safe.sources ?? []).length === 0 && (
                                    <div className="text-sm" style={{ color: "var(--subtext)" }}>No sources provided.</div>
                                )}
                                {(safe.sources ?? []).map((s, i) => {
                                    const pct = toPercent(s.credibility_score ?? 0);
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-sm" style={{ color: "var(--text)" }}>{s.name}</a>
                                                <div className="text-xs mt-1" style={{ color: "var(--subtext)" }}>{s.url}</div>
                                                <div className="h-2 w-full rounded-full overflow-hidden mt-2" style={{ background: "var(--border)" }}>
                                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--midBlue)" }} />
                                                </div>
                                            </div>
                                            <div className="w-14 text-right text-sm font-semibold" style={{ color: "var(--text)" }}>{pct}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= Formal Reporting Section (separate) ================= */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>Formal Reporting</h2>
                    <div className="rounded-3xl border p-5 md:p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowFormal((s) => !s)} className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                                {showFormal ? "Hide Formal Report" : "View Formal Report"}
                            </button>
                            <button onClick={downloadFormalReport} className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                                <Download size={14} /> Download
                            </button>
                            <button onClick={copyFormalReport} className="px-3 py-2 rounded-xl border text-sm inline-flex items-center gap-2" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                                <Clipboard size={14} /> {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                        {showFormal && (
                            <div className="mt-3 p-3 rounded-md border" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.02)" }}>
                                <pre className="text-xs whitespace-pre-wrap" style={{ color: "var(--text)" }}>{safe.formal_report ?? "No formal report available."}</pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= Our Methodologies Section ================= */}
                <div id="methodology">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>Our Methodologies</h2>
                    <div className="rounded-3xl border p-5 md:p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>How we score</h3>
                            <a href="https://example.com/methodology" target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                                Read more <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {[
                                { title: "Clarity", body: "Measures readability, structure, and concise phrasing." },
                                { title: "Tone", body: "Checks for audience fit, consistency, and sentiment." },
                                { title: "Correctness", body: "Flags grammar, spelling, and factual mismatches." },
                                { title: "Originality", body: "Assesses uniqueness and avoidance of plagiarism." }
                            ].map((card, i) => (
                                <div key={i} className="rounded-2xl border p-4 h-full" style={{ borderColor: "var(--border)" }}>
                                    <div className="font-medium" style={{ color: "var(--text)" }}>{card.title}</div>
                                    <div className="text-sm mt-1" style={{ color: "var(--subtext)" }}>{card.body}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
