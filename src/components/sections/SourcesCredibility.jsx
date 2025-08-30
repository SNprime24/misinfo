import React from "react";
import { clamp } from "../charts/chartUtils";

export default function SourcesCredibility({ sourcesCred = [], palette }) {
    return (
        <section className="rounded-3xl border p-3 sm:p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-3">
                <div className="font-bold" style={{ color: "var(--text)" }}>Sources & Credibility</div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>{sourcesCred.length} sources</div>
            </div>
            <div className="space-y-3">
                {sourcesCred.map((s, i) => {
                    const pct = clamp(s, 0, 100);
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-semibold" style={{ color: "var(--text)" }}>Source {i + 1}</div>
                                    <div style={{ color: "var(--subtext)" }}>{pct}%</div>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden mt-2" style={{ background: "var(--border)" }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: "var(--gradientBlueGreen)" }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
