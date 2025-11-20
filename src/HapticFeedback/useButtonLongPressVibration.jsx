import { useEffect } from "react";
import { vibrate } from "./Vibrate.js";

export function useButtonLongPressVibration() {
    useEffect(() => {
        const handler = (event) => {
            const target = event.target;
            if (!target) return;

            const button = target.closest("button, [role='button'], [data-vibrate-button]");
            if (!button) return;

            vibrate(5);
        };

        // contextmenu == right-click on desktop + long-press on mobile
        document.addEventListener("contextmenu", handler);

        return () => {
            document.removeEventListener("contextmenu", handler);
        };
    }, []);
}
