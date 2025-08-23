import { Moon, Sun } from "lucide-react";

const Header = ({theme, setTheme}) => {
    return (
        <header className="w-full sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-2xl" style={{ background: "var(--accent)" }} />
                    <div>
                        <div className="text-sm tracking-widest font-bold uppercase" style={{ color: "var(--text)" }}>BlueFlower</div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>AI Analyzer</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <a href="#learn" className="text-sm px-3 py-1.5 rounded-xl border hover:opacity-90" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Learn</a>
                    <button
                        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                        className="px-3 py-1.5 rounded-xl border flex items-center gap-2"
                        style={{ borderColor: "var(--border)", color: "var(--text)" }}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        <span className="text-sm">{theme === "dark" ? "Light" : "Dark"}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
