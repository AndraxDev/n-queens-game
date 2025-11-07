import './App.css'
import BaseWindow from "./Components/BaseWindow.jsx";
import GameField from "./Components/GameField/GameField.jsx";
import React, {useEffect} from "react";
import {generateLevel} from "./GameLevelGenerator/GameLevelGenerator.js";

const levelData = generateLevel();

function App() {
    const [gameState, setGameState] = React.useState(levelData);
    const [field, setField] = React.useState(levelData.field);
    const [gameHasWon, setGameHasWon] = React.useState(false);

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
                <br/><br/>
                <GameField gameState={gameState} onCellClick={handleCellClick} gameHasWon={gameHasWon} />
            </BaseWindow>
        </>
    )
}

export default App
