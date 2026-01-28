import {enUS} from "./en-US.jsx";
import {deDE} from "./de-DE.jsx";

export const localizations = [
    "en-US",
    "de-DE"
]

export const setLanguage = (language) => {
    if (localizations.includes(language)) {
        localStorage.setItem("language", language);
    } else {
        console.error("Unsupported language: " + language);
    }
}

export const getLanguage = () => {
    return localStorage.getItem("language") || "en-US";
}

export const getLocalizedString = (key) => {
    const language = getLanguage();

    let strings;

    switch (language) {
        case "en-US":
            strings = enUS;
            break;
        case "de-DE":
            strings = deDE;
            break;
        default:
            strings = enUS;
            break;
    }

    return strings[key];
}
