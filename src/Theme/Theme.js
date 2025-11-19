const darkColorBoardScheme = [
    "#407038",
    "#754c2e",
    "#0e5d7a",
    "#652a78",
    "#7c2222",
    "#1b755a",
    "#786e00",
    "#223375",
    "#681356",
    "#403a3a",
    "#555c28",
    "#233f53",
];

const lightColorBoardScheme = [
    "#94ff80",
    "#ffb680",
    "#81dfff",
    "#e18eff",
    "#ff9494",
    "#8fffde",
    "#fff698",
    "#92a8ff",
    "#ff8fe8",
    "#b5b5b5",
    "#d9ffa0",
    "#c2e3ff",
];

export const dark = {
    id: "dark",
    isDark: true,
    cellHoverBackgroundColor: "rgba(255, 255, 255, 0.2)",
    cellActiveBackgroundColor: "rgba(255, 255, 255, 0.4)",
    cellIncorrectColor: "#ff6b6b",
    cellNoteColor: "rgba(0, 0, 0, 0.9)",
    cellEvenOpacity: 0.8,
    cellOddOpacity: 0.6,
    overlayBackgroundColor: "rgba(18, 18, 18, 0.6)",
    btnBackgroundColor: "#212121",
    btnForegroundColor: "#ffffff",
    btnActiveBackgroundColor: "#ffffff",
    btnActiveForegroundColor: "#000000",
    btnSettingsColor: "#212121",
    btnSettingsHoverColor: "#323232",
    btnSettingsActiveColor: "#424242",
    settingsLevelSizeLabelColor: "#ffffff",
    settingsLevelSizeActiveBackgroundColor: "#ffffff",
    settingsLevelSizeActiveLabelColor: "#000000",
    settingsLevelSizeContainerBackgroundColor: "rgba(15, 15, 15, 0.5)",
    windowBackBtnBackgroundColor: "rgba(15, 15, 15, 0.5)",
    windowBackBtnActiveBackgroundColor: "rgba(55, 55, 55, 0.5)",
    windowBackBtnHoverBackgroundColor: "rgba(45, 45, 45, 0.5)",
    linkDevColor: "#ff4646",
    linkDevHoverColor: "#ffaeae",
    rootBackgroundColor: "#121212",
    rootTextColor: "rgba(255, 255, 255, 0.87)",
    gameFieldBackgroundColor: "#121212",
    fieldColorScheme: darkColorBoardScheme
};

export const amoled = {
    id: "amoled",
    isDark: true,
    cellHoverBackgroundColor: "rgba(255, 255, 255, 0.2)",
    cellActiveBackgroundColor: "rgba(255, 255, 255, 0.4)",
    cellIncorrectColor: "#ff6b6b",
    cellNoteColor: "rgba(0, 0, 0, 0.9)",
    cellEvenOpacity: 0.8,
    cellOddOpacity: 0.6,
    overlayBackgroundColor: "rgba(0, 0, 0, 0.7)",
    btnBackgroundColor: "#121212",
    btnForegroundColor: "#ffffff",
    btnActiveBackgroundColor: "#ffffff",
    btnActiveForegroundColor: "#000000",
    btnSettingsColor: "#121212",
    btnSettingsHoverColor: "#212121",
    btnSettingsActiveColor: "#323232",
    settingsLevelSizeLabelColor: "#ffffff",
    settingsLevelSizeActiveBackgroundColor: "#ffffff",
    settingsLevelSizeActiveLabelColor: "#000000",
    settingsLevelSizeContainerBackgroundColor: "rgba(5, 5, 5, 0.5)",
    windowBackBtnBackgroundColor: "rgba(15, 15, 15, 0.5)",
    windowBackBtnActiveBackgroundColor: "rgba(55, 55, 55, 0.5)",
    windowBackBtnHoverBackgroundColor: "rgba(45, 45, 45, 0.5)",
    linkDevColor: "#ff4646",
    linkDevHoverColor: "#ffaeae",
    rootBackgroundColor: "#000000",
    rootTextColor: "rgba(255, 255, 255, 0.87)",
    gameFieldBackgroundColor: "#121212",
    fieldColorScheme: darkColorBoardScheme
};

export const light = {
    id: "light",
    isDark: false,
    cellHoverBackgroundColor: "rgba(0, 0, 0, 0.2)",
    cellActiveBackgroundColor: "rgba(0, 0, 0, 0.4)",
    cellIncorrectColor: "#ff2e2e",
    cellNoteColor: "rgba(0, 0, 0, 0.6)",
    cellEvenOpacity: 0.9,
    cellOddOpacity: 0.8,
    overlayBackgroundColor: "rgba(255, 255, 255, 0.8)",
    btnBackgroundColor: "#d9e4d1",
    btnForegroundColor: "#313a2d",
    btnActiveBackgroundColor: "#313a2d",
    btnActiveForegroundColor: "#ffffff",
    btnSettingsColor: "#48613d",
    btnSettingsHoverColor: "#323232",
    btnSettingsActiveColor: "#424242",
    settingsLevelSizeLabelColor: "#121212",
    settingsLevelSizeActiveBackgroundColor: "#48613d",
    settingsLevelSizeActiveLabelColor: "#ffffff",
    settingsLevelSizeContainerBackgroundColor: "rgba(202,220,190,0.87)",
    windowBackBtnBackgroundColor: "#d9e4d1",
    windowBackBtnActiveBackgroundColor: "#acc1a4",
    windowBackBtnHoverBackgroundColor: "#b7caaf",
    linkDevColor: "#ff4646",
    linkDevHoverColor: "#773434",
    rootBackgroundColor: "#ffffff",
    rootTextColor: "rgba(0, 0, 0, 0.87)",
    gameFieldBackgroundColor: "#121212",
    fieldColorScheme: lightColorBoardScheme
};

const themes = [
    light, dark, amoled
]

const getThemeById = (id) => {
    return themes.find(theme => theme.id === id) || dark;
}

export const getTheme = () => {
    return getThemeById(localStorage.getItem("theme") || "dark");
}
