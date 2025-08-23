import { motion } from "framer-motion";

const HeroSection = ({
  theme,
  input,
  setInput,
  handleAnalyze,
  loading,
  error,
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          src="https://my.spline.design/particleaibrain-DVMozu9KHZbquQ2N2fnJZUok/"
          frameBorder="0"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Spline Scene"
        />
      </div>
      {/* Overlay CTA card */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="rounded-3xl shadow-2xl border p-4 md:p-6 backdrop-blur"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste text or a URL to analyze…"
                  className="flex-1 w-full px-4 py-3 rounded-2xl border outline-none focus:ring-2"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.9)",
                    color: "var(--text)",
                    borderColor: "var(--border)",
                    boxShadow: `0 0 0 0 rgba(0,0,0,0)`,
                  }}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !input.trim()}
                  className="shrink-0 px-5 py-3 rounded-2xl font-semibold hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-spin inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent" />
                      Analyzing…
                    </span>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>
              {error && (
                <div
                  className="mt-3 text-sm"
                  style={{ color: "var(--subtext)" }}
                >
                  {error}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
