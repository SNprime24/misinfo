import { Download, Info, ExternalLink } from "lucide-react";

function Progress({ value, label }) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <span className="text-sm" style={{ color: "var(--subtext)" }}>{label}</span>
        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{toPercent(value)}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full" style={{ width: `${toPercent(value)}%`, background: "var(--accent)" }} />
      </div>
    </div>
  );
}

function toPercent(x) {
  if (typeof x !== "number" || isNaN(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x * 100)));
}

const ResultSection = ({
    score,
    result
}) => {
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-6xl mx-auto px-4 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6 justify-between">
                <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                    Results
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--subtext)" }}>
                    Clear, educational insights designed for quick scanning.
                </p>
                </div>
                <div className="flex items-center gap-2">
                <button onClick={() => setRawOpen(true)} className="px-3 py-2 rounded-xl border text-sm inline-flex items-center gap-2" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                    <Info size={16} /> Raw JSON
                </button>
                <button className="px-3 py-2 rounded-xl border text-sm inline-flex items-center gap-2" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                    <Download size={16} /> Export
                </button>
                </div>
            </div>

            {/* Score + Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="rounded-3xl border p-5 md:p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="text-sm" style={{ color: "var(--subtext)" }}>Overall Score</div>
                <div className="mt-2 flex items-center gap-4">
                    <div className="relative grid place-items-center h-24 w-24 rounded-full">
                    <svg viewBox="0 0 36 36" className="h-24 w-24">
                        <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="var(--border)" strokeWidth="3" />
                        <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${score},100`} />
                    </svg>
                    <div className="absolute text-xl font-semibold" style={{ color: "var(--text)" }}>{score}<span className="text-xs">%</span></div>
                    </div>
                    <div className="flex-1 space-y-3">
                    <Progress value={result?.metrics?.clarity ?? 0} label="Clarity" />
                    <Progress value={result?.metrics?.tone ?? 0} label="Tone" />
                    <Progress value={result?.metrics?.correctness ?? 0} label="Correctness" />
                    </div>
                </div>
                </div>
                <div className="rounded-3xl border p-5 md:p-6 md:col-span-2" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="text-sm" style={{ color: "var(--subtext)" }}>Summary</div>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--text)" }}>
                    {result?.summary ?? "Run an analysis to see a concise summary here."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {(result?.highlights ?? []).map((h, i) => (
                    <Highlight key={i} text={h} />
                    ))}
                </div>
                </div>
            </div>

            {/* Entities + Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="rounded-3xl border p-5 md:p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="text-sm mb-2" style={{ color: "var(--subtext)" }}>Detected Entities</div>
                <div className="space-y-2">
                    {(result?.entities ?? []).length === 0 && (
                    <div className="text-sm" style={{ color: "var(--subtext)" }}>No entities yet.</div>
                    )}
                    {(result?.entities ?? []).map((e, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: "var(--border)" }}>
                        <span className="text-sm" style={{ color: "var(--text)" }}>{e.text}</span>
                        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "color-mix(in oklab, var(--accent) 10%, transparent)", color: "var(--accent)" }}>{e.type}</span>
                    </div>
                    ))}
                </div>
                </div>
                <div className="rounded-3xl border p-5 md:p-6 md:col-span-2" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="text-sm mb-3" style={{ color: "var(--subtext)" }}>Top Tips</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(result?.tips ?? []).map((t, i) => (
                    <div key={i} className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
                        <div className="font-medium" style={{ color: "var(--text)" }}>{t.title}</div>
                        <div className="text-sm mt-1" style={{ color: "var(--subtext)" }}>{t.detail}</div>
                    </div>
                    ))}
                    {(result?.tips ?? []).length === 0 && (
                    <div className="text-sm" style={{ color: "var(--subtext)" }}>Run an analysis to see tailored recommendations.</div>
                    )}
                </div>
                </div>
            </div>

            {/* EDUCATIONAL SECTION */}
            <div id="learn" className="rounded-3xl border p-5 md:p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>How we score</h3>
                <a href="https://example.com/methodology" target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                    Read more <ExternalLink size={14} />
                </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[
                    { title: "Clarity", body: "Measures readability, structure, and concise phrasing." },
                    { title: "Tone", body: "Checks for audience fit, consistency, and sentiment." },
                    { title: "Correctness", body: "Flags grammar, spelling, and factual mismatches." },
                ].map((card, i) => (
                    <div key={i} className="rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="font-medium" style={{ color: "var(--text)" }}>{card.title}</div>
                    <div className="text-sm mt-1" style={{ color: "var(--subtext)" }}>{card.body}</div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </section>
    )
}

export default ResultSection;