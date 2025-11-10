import './App.css'
import BaseWindow from "./Components/BaseWindow.jsx";
import GameField from "./Components/GameField/GameField.jsx";
import React, {useEffect} from "react";
import {generateLevel, getFieldSize, setFieldSize} from "./GameLevelGenerator/GameLevelGenerator.js";
import OverlayWindow from "./Components/OverlayWindow.jsx";
import {loadLevel} from "./Levels/LevelLoader.js";
import { version } from "../package.json"

const levelData = JSON.parse(localStorage.getItem("gameState")) ?? loadLevel();

function App() {
    const [gameState, setGameState] = React.useState(levelData);
    const [field, setField] = React.useState(levelData.field);
    const [gameHasWon, setGameHasWon] = React.useState(false);
    const [rulesDialogOpen, setRulesDialogOpen] = React.useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
    const [fSize, setFSize] = React.useState(getFieldSize());

    useEffect(() => {
        if (gameState) {
            localStorage.setItem("gameState", JSON.stringify(gameState));
        }
    }, [gameState])

    const countCrownsInRegion = (region) => {
        let count = 0;
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                if (gameState.level[x][y] === region && gameState.field[x][y] === 2) {
                    count++;
                }
            }
        }

        return count;
    }

    // Neighbor for vertical, horizontal and diagonal cells
    const checkNeighborCellForCrowns = (x, y) => {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let dir of directions) {
            const newX = x + dir[0];
            const newY = y + dir[1];

            if (newX >= 0 && newX < gameState.height && newY >= 0 && newY < gameState.width) {
                if (gameState.field[newX][newY] === 2 && gameState.field[x][y] === 2) {
                    return true;
                }
            }
        }

        return false;
    }

    const checkRowForMultipleCrowns = (row) => {
        let crownCount = 0;
        for (let y = 0; y < gameState.width; y++) {
            if (gameState.field[row][y] === 2) {
                crownCount++;
            }
        }
        return crownCount > 1;
    }

    const checkColumnForMultipleCrowns = (col) => {
        let crownCount = 0;
        for (let x = 0; x < gameState.height; x++) {
            if (gameState.field[x][col] === 2) {
                crownCount++;
            }
        }
        return crownCount > 1;
    }

    const checkFieldRowsAndColumnsForMultipleCrowns = () => {
        for (let i = 0; i < gameState.height; i++) {
            if (checkRowForMultipleCrowns(i)) {
                for (let y = 0; y < gameState.width; y++) {
                    gameState.error[i][y] = 1;
                    setGameHasWon(false);
                }
            }
        }

        for (let i = 0; i < gameState.width; i++) {
            if (checkColumnForMultipleCrowns(i)) {
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
                if (checkNeighborCellForCrowns(x, y)) {
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

    const countCrownsInField = () => {
        let count = 0;
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                if (gameState.field[x][y] === 2) {
                    count++;
                }
            }
        }

        return count;
    }

    const fieldHasErrors = () => {
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                if (gameState.error[x][y] === 1) {
                    return true;
                }
            }
        }

        return false;
    }

    const checkWinCondition = () => {
        if (countCrownsInField() === gameState.field.length && !fieldHasErrors()) {
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
            if (countCrownsInRegion(i) > 1) {
                markRegionAsError(i, 1);
                setGameHasWon(false);
            } else {
                markRegionAsError(i, 0);
            }
        }

        checkFullFieldForNeighboringCrowns();
        checkFieldRowsAndColumnsForMultipleCrowns();
        checkWinCondition();
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
        <>
            <BaseWindow>
                <OverlayWindow id={"settings-dialog"} open={settingsDialogOpen} setOpen={setSettingsDialogOpen} title={"Settings"}>
                    <div className={"settings-block"}>
                        <h2>Level size</h2>
                        <div className={"level-size-btn-container"}>
                            {
                                [6, 7, 8, 9, 10, 11, 12].map((i) => (
                                    <button key={"field-btn-" + i} className={"btn-level-size " + (fSize === i ? "btn-level-size-active" : "")} onClick={() => {
                                        setFSize(i);
                                        setFieldSize(i);
                                    }}>{i}</button>
                                ))
                            }
                        </div>
                        <br/>
                        <p className={"guide-text"}>Settings are saved automatically. This setting applies to your next level. Finish your current level or click "New level" to change board size.</p>
                    </div>
                    <div className={"guide"}>
                        <span className={"guide-text"}>Queens version {version} developed by <a target={"_blank"} rel={"noreferrer"} href={"https://andrax.dev"} className={"link-dev"}>AndraxDev</a>. Inspired from popular LinkedIn puzzle.</span>
                    </div>
                </OverlayWindow>
                <OverlayWindow id={"rules-dialog"} open={rulesDialogOpen} setOpen={setRulesDialogOpen} title={"How to play?"}>
                    <div className={"guide"}>
                        <p className={"guide-text"}>Place queens on the board so each row, column and color region contains exactly one queen.</p>
                        <img className={"guide-img"} src={"/scenario/correct.png"} alt={"Correct answer"}/>
                        <br/>
                        <p className={"guide-text"}>You can make notes using crosses like where a queen cannot be placed. It does not affect gameplay.</p>
                        <img className={"guide-img"} src={"/scenario/crosses.png"} alt={"Crosses"}/>
                        <br/>
                        <p className={"guide-text"}>Queens MUST NOT touch each other even diagonally.</p>
                        <img className={"guide-img"} src={"/scenario/diagonal_touch.png"} alt={"Diagonal touch"}/>
                        <br/>
                        <p className={"guide-text"}>Each row and colum must not have multiple queens.</p>
                        <img className={"guide-img"} src={"/scenario/row_column_duplicate.png"} alt={"Row/Column contains multiple queens"}/>
                        <br/>
                        <p className={"guide-text"}>Each color region must not have multiple queens.</p>
                        <img className={"guide-img"} src={"/scenario/region_duplicate.png"} alt={"Color region contains multiple queens"}/>
                    </div>
                </OverlayWindow>
                <div className={"Game-Settings-Pane-Overlay"}>
                    <button onClick={() => {
                        setSettingsDialogOpen(true);
                    }} className={"Game-Settings-btn"}><div style={{
                        width: "24px",
                        height: "24px",
                        lineHeight: "1",
                    }} disabled>
                        <img src={"/settings.svg"} alt={"Settings"}/>
                    </div></button>
                </div>
                <div className={"Game-Header"}>
                    <h1>Queens</h1>
                </div>
                <GameField gameState={gameState} onCellClick={handleCellClick} gameHasWon={gameHasWon} onCloseWinScreen={() => {
                    setGameHasWon(false);
                }} />
                <div className={"Game-Actions"}>
                    <div className={"Game-Actions-group"}>
                        <button className={"Game-Actions-btn"} onClick={() => {
                            clearBoard();
                            setGameHasWon(false);
                        }}>Clear board</button>
                        <button className={"Game-Actions-btn"} onClick={() => {
                            putRandomQueenInEmptyCell();
                        }}>Hint</button>
                    </div>
                    <div className={"Game-Actions-group"}>
                        <button className={"Game-Actions-btn"} onClick={() => {
                            clearBoard();
                            const newLevel = generateLevel();
                            setGameState(newLevel);
                            setField(newLevel.field);
                            setGameHasWon(false);
                        }}>New level</button>
                        <button onClick={() => {
                            setRulesDialogOpen(true);
                        }} className={"Game-Actions-btn"}>Rules</button>
                    </div>
                </div>
            </BaseWindow>
        </>
    )
}

export default App
