export function toPercent(x) {
    if (typeof x !== "number" || isNaN(x)) return 0;
    if (Math.abs(x) <= 1) return Math.max(0, Math.min(100, Math.round(x * 100)));
    return Math.max(0, Math.min(100, Math.round(x)));
}