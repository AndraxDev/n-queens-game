import "./App.css"
import BaseWindow from "./Components/BaseWindow.jsx";
import GameField from "./Components/GameField/GameField.jsx";
import React, { useEffect } from "react";
import {
    generateLevel,
    getFieldSize,
    setFieldSize
} from "./GameLogic/GameLevelGenerator.js";
import OverlayWindow from "./Components/OverlayWindow.jsx";
import {loadLevel} from "./Levels/LevelLoader.js";
import { version } from "../package.json"
import {
    checkNeighborCellForCrowns,
    checkRowForMultipleCrowns,
    checkColumnForMultipleCrowns,
    countCrownsInField,
    countCrownsInRegion,
    fieldHasErrors
} from "./GameLogic/GameLogic.js";
import {generateArray} from "./util.js";
import {isMobile} from "react-device-detect";
import {getTheme, setThemeById, themes} from "./Theme/Theme.js";
import {useButtonLongPressVibration} from "./HapticFeedback/useButtonLongPressVibration.jsx";
import {getLanguage, getLocalizedString, setLanguage} from "./Localization/Localization.jsx";

const levelData = JSON.parse(localStorage.getItem("gameState")) ?? loadLevel();

function App() {
    useButtonLongPressVibration();

    const [gameState, setGameState] = React.useState(levelData);
    const [field, setField] = React.useState(levelData.field);
    const [gameHasWon, setGameHasWon] = React.useState(false);
    const [rulesDialogOpen, setRulesDialogOpen] = React.useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
    const [fSize, setFSize] = React.useState(getFieldSize());
    const [theme, setTheme] = React.useState(getTheme());
    const [experimentalInputEnabled, setExperimentalInputEnabled] = React.useState(localStorage.getItem("exp_input") === "true");

    const setExperimentalInput = (enabled) => {
        setExperimentalInputEnabled(enabled);
        localStorage.setItem("exp_input", enabled ? "true" : "false");
    }

    // Handling inset for status bar and navigation bar on mobile devices
    const queryParams = new URLSearchParams(window.location.search);
    const sbw = queryParams.get("sbw");
    const nbw = queryParams.get("nbw");
    const statusBarWidth = parseInt(sbw ?? 0, 10);
    const navigationBarWidth = parseInt(nbw ?? 0, 10);

    useEffect(() => {
        if (gameState) {
            localStorage.setItem("gameState", JSON.stringify(gameState));
        }
    }, [gameState])

    const checkFieldRowsAndColumnsForMultipleCrowns = () => {
        for (let i = 0; i < gameState.height; i++) {
            if (checkRowForMultipleCrowns(gameState, i)) {
                for (let y = 0; y < gameState.width; y++) {
                    gameState.error[i][y] = 1;
                    setGameHasWon(false);
                }
            }
        }

        for (let i = 0; i < gameState.width; i++) {
            if (checkColumnForMultipleCrowns(gameState, i)) {
                for (let x = 0; x < gameState.height; x++) {
                    gameState.error[x][i] = 1;
                    setGameHasWon(false);
                }
            }
        }
    }

    const checkFullFieldForNeighboringCrowns = () => {
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                if (checkNeighborCellForCrowns(gameState, x, y)) {
                    gameState.error[x][y] = 1;
                    setGameHasWon(false);
                }
            }
        }

        setGameState({...gameState});
    }

    const markRegionAsError = (region, error) => {
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                if (gameState.level[x][y] === region) {
                    gameState.error[x][y] = error;
                }
            }
        }

        setGameState({...gameState});
    }

    const checkWinCondition = () => {
        if (countCrownsInField(gameState) === gameState.field.length && !fieldHasErrors(gameState)) {
            setGameHasWon(true);
        } else {
            setGameHasWon(false);
        }
    }

    const clearBoard = () => {
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                gameState.field[x][y] = 0;
                gameState.error[x][y] = 0;
            }
        }

        setGameState({...gameState});
        setField([...gameState.field]);
        setGameHasWon(false);
    }

    useEffect(() => {
        for (let i = 0; i < gameState.height; i++) {
            if (countCrownsInRegion(gameState, i) > 1) {
                markRegionAsError(i, 1);
                setGameHasWon(false);
            } else {
                markRegionAsError(i, 0);
            }
        }

        checkFullFieldForNeighboringCrowns();
        checkFieldRowsAndColumnsForMultipleCrowns();
        checkWinCondition();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field])

    const putRandomQueenInEmptyCell = () => {
        let seeds = JSON.parse(localStorage.getItem("seeds"));

        if (!seeds) {
            throw new Error("Could not find correct answers. Try clearing app data or reset a level.");
        } else {
            for (let x = 0; x < seeds.length; x++) {
                for (let y = 0; y < seeds[0].length; y++) {
                    if (seeds[x][y] >= 0 && gameState.field[x][y] !== 2) {
                        gameState.field[x][y] = 2;

                        setGameState({...gameState});
                        setField([...gameState.field]);
                        return;
                    }
                }
            }
        }
    }

    const handleCellClick = (x, y, action) => {
        let cellValue = gameState.field[x][y];

        if (cellValue === 2 && action === 1) {
            gameState.field[x][y] = 0; // Clear cell
        } else if (cellValue === 0 && action === -1) {
            gameState.field[x][y] = 2; // Place queen
        } else {
            gameState.field[x][y] += action;
        }

        setField([...field])
        setGameState({...gameState});
    }

    return (
        <div style={{
            paddingTop: statusBarWidth + "px",
            "--overlay-background-color": theme.overlayBackgroundColor,
            "--btn-background-color": theme.btnBackgroundColor,
            "--btn-foreground-color": theme.btnForegroundColor,
            "--btn-active-background-color": theme.btnActiveBackgroundColor,
            "--btn-active-foreground-color": theme.btnActiveForegroundColor,
            "--btn-settings-color": theme.btnSettingsColor,
            "--btn-settings-hover-color": theme.btnSettingsHoverColor,
            "--btn-settings-active-color": theme.btnSettingsActiveColor,
            "--cell-hover-color": theme.cellHoverBackgroundColor,
            "--cell-active-color": theme.cellActiveBackgroundColor,
            "--cell-incorrect-color": theme.cellIncorrectColor,
            "--cell-note-color": theme.cellNoteColor,
            "--cell-even-opacity": theme.cellEvenOpacity,
            "--cell-odd-opacity": theme.cellOddOpacity,
            "--settings-level-size-label-color": theme.settingsLevelSizeLabelColor,
            "--settings-level-size-active-background-color": theme.settingsLevelSizeActiveBackgroundColor,
            "--settings-level-size-active-label-color": theme.settingsLevelSizeActiveLabelColor,
            "--settings-level-size-container-background-color": theme.settingsLevelSizeContainerBackgroundColor,
            "--window-back-btn-background-color": theme.windowBackBtnBackgroundColor,
            "--window-back-btn-hover-background-color": theme.windowBackBtnHoverBackgroundColor,
            "--window-back-btn-active-background-color": theme.windowBackBtnActiveBackgroundColor,
            "--link-dev-color": theme.linkDevColor,
            "--link-dev-hover-color": theme.linkDevHoverColor,
            "--root-background-color": theme.rootBackgroundColor,
            "--root-text-color": theme.rootTextColor,
            "--game-field-background-color": theme.gameFieldBackgroundColor,
            "--window-allowed-min-height": "calc(100dvh - " + (statusBarWidth + navigationBarWidth) + "px)",
        }} className={"app-container"}>
            <BaseWindow>
                <OverlayWindow statusBarWidth={statusBarWidth} navigationBarHeight={navigationBarWidth} theme={theme} id={"settings-dialog"} open={settingsDialogOpen} setOpen={setSettingsDialogOpen} title={getLocalizedString("settings")}>
                    <div className={"settings-block"}>
                        <h2 className={"settings-section-title"}>{getLocalizedString("boardSize")}</h2>
                        <div className={"level-size-btn-container"}>
                            {
                                // Higher board size may not be suitable for mobile devices
                                (isMobile ? generateArray(6, 12) : generateArray(6, 24)).map((i) => (
                                    <button key={"field-btn-" + i} className={"btn-level-size " + (fSize === i ? "btn-level-size-active" : "")} onClick={() => {
                                        setFSize(i);
                                        setFieldSize(i);
                                    }}>{i}</button>
                                ))
                            }
                        </div>
                        <br/>
                        <h2 className={"settings-section-title"}>{getLocalizedString("theme")}</h2>
                        <div className={"level-size-btn-container"}>
                            {
                                themes.map(t => (<button key={t.id} style={{
                                    width: "auto"
                                }} className={"btn-level-size " + (theme.id === t.id ? "btn-level-size-active" : "")} onClick={() => {
                                    setTheme(setThemeById(t.id))
                                }}>{t.label}</button>))
                            }
                        </div>
                        <br/>
                        <h2 className={"settings-section-title"}>{getLocalizedString("language")}</h2>
                        <div className={"level-size-btn-container"}>
                            {
                                [
                                    {
                                        code: "en-US",
                                        label: "English"
                                    },
                                    {
                                        code: "de-DE",
                                        label: "Deutsche"
                                    }
                                ].map(t => (<button key={t.code} style={{
                                    width: "auto"
                                }} className={"btn-level-size " + (t.code === getLanguage() ? "btn-level-size-active" : "")} onClick={() => {
                                    setLanguage(t.code)
                                    window.location.reload();
                                }}>{t.label}</button>))
                            }
                        </div>
                        <br/>
                        <h2 className={"settings-section-title"}>{getLocalizedString("experimentalInput")}</h2>
                        <div className={"level-size-btn-container"}>
                            <button style={{
                                width: "auto"
                            }} className={"btn-level-size " + (experimentalInputEnabled ? "btn-level-size-active" : "")} onClick={() => {
                                setExperimentalInput(true)
                            }}>{getLocalizedString("on")}</button>
                            <button style={{
                                width: "auto"
                            }} className={"btn-level-size " + (!experimentalInputEnabled ? "btn-level-size-active" : "")} onClick={() => {
                                setExperimentalInput(false)
                            }}>{getLocalizedString("off")}</button>
                        </div>
                        <br/>
                        <p className={"guide-text"}>{getLocalizedString("settingsSaved")}<br/><br/>{getLocalizedString("amoledNotice")}</p>
                    </div>
                    <div className={"guide"}>
                        <span className={"guide-text"}>Queens version {version} developed by <a target={"_blank"} rel={"noreferrer"} href={"https://andrax.dev"} className={"link-dev"}>AndraxDev</a>. Inspired from popular LinkedIn puzzle.</span>
                    </div>
                </OverlayWindow>
                <OverlayWindow statusBarWidth={statusBarWidth} navigationBarHeight={navigationBarWidth} theme={theme} id={"rules-dialog"} open={rulesDialogOpen} setOpen={setRulesDialogOpen} title={getLocalizedString("howToPlay")}>
                    <div className={"guide"}>
                        <p className={"guide-text"}>{getLocalizedString("rule1")}</p>
                        <img className={"guide-img"} src={"/scenario/correct.png"} alt={getLocalizedString("rule1alt")}/>
                        <br/>
                        <p className={"guide-text"}>{getLocalizedString("rule2")}</p>
                        <img className={"guide-img"} src={"/scenario/crosses.png"} alt={getLocalizedString("rule2alt")}/>
                        <br/>
                        <p className={"guide-text"}>{getLocalizedString("rule3")}</p>
                        <img className={"guide-img"} src={"/scenario/diagonal_touch.png"} alt={getLocalizedString("rule3alt")}/>
                        <br/>
                        <p className={"guide-text"}>{getLocalizedString("rule4")}</p>
                        <img className={"guide-img"} src={"/scenario/row_column_duplicate.png"} alt={getLocalizedString("rule4alt")}/>
                        <br/>
                        <p className={"guide-text"}>{getLocalizedString("rule5")}</p>
                        <img className={"guide-img"} src={"/scenario/region_duplicate.png"} alt={getLocalizedString("rule5alt")}/>
                    </div>
                </OverlayWindow>
                <div className={"Game-Settings-Pane-Overlay"}>
                    <button onClick={() => {
                        setSettingsDialogOpen(true);
                    }} className={"Game-Settings-btn"}><div style={{
                        width: "24px",
                        height: "24px",
                        lineHeight: "1"
                    }} disabled>
                        <img src={"/settings.svg"} alt={getLocalizedString("settings")}/>
                    </div></button>
                </div>
                <div className={"Game-Header"}>
                    <h1>{getLocalizedString("appName")}</h1>
                </div>
                <GameField statusBarHeight={statusBarWidth} theme={theme} gameState={gameState} onCellClick={handleCellClick} gameHasWon={gameHasWon} onCloseWinScreen={() => {
                    setGameHasWon(false);
                }} />
                <div className={"Game-Actions"}>
                    <div className={"Game-Actions-group"}>
                        <button disabled={gameHasWon} className={"Game-Actions-btn" + (gameHasWon ? " Game-Actions-btn-disabled" : "")} onClick={() => {
                            clearBoard();
                            setGameHasWon(false);
                        }}>{getLocalizedString("clearBoard")}</button>
                        <button disabled={gameHasWon} className={"Game-Actions-btn" + (gameHasWon ? " Game-Actions-btn-disabled" : "")} onClick={() => {
                            putRandomQueenInEmptyCell();
                        }}>{getLocalizedString("hint")}</button>
                    </div>
                    <div className={"Game-Actions-group"}>
                        <button className={"Game-Actions-btn"} onClick={() => {
                            clearBoard();
                            const newLevel = generateLevel();
                            setGameState(newLevel);
                            setField(newLevel.field);
                            setGameHasWon(false);
                        }}>{getLocalizedString("newLevel")}</button>
                        <button onClick={() => {
                            setRulesDialogOpen(true);
                        }} className={"Game-Actions-btn"}>{getLocalizedString("rules")}</button>
                    </div>
                </div>
            </BaseWindow>
            <div style={{
                height: navigationBarWidth + "px",
            }} />
        </div>
    )
}

export default App
