export function vibrate(pattern) {
    if (typeof window === "undefined") return false;
    if (!("vibrate" in navigator)) return false;

    return navigator.vibrate(pattern);
}