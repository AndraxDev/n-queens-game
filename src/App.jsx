import './App.css'
import BaseWindow from "./Components/BaseWindow.jsx";
import GameField from "./Components/GameField/GameField.jsx";
import React, {useEffect} from "react";

const ExampleGameLevel = {
    width: 6,
    height: 6,
    level: [
        [0, 0, 1, 1, 1, 2],
        [0, 0, 0, 0, 1, 2],
        [3, 3, 0, 0, 1, 2],
        [3, 3, 3, 5, 5, 2],
        [3, 3, 3, 4, 5, 5],
        [3, 3, 3, 4, 4, 5],
    ],
    field: [ // 0 - empty, 1 - cross, 2 - queen
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ],
    error: [ // 0 - empty, 1 - error
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ]
}

function App() {

    const [gameState, setGameState] = React.useState(ExampleGameLevel);
    const [field, setField] = React.useState(ExampleGameLevel.field);

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
                }
            }
        }

        for (let i = 0; i < gameState.width; i++) {
            if (checkColumnForMultipleCrowns(i)) {
                for (let x = 0; x < gameState.height; x++) {
                    gameState.error[x][i] = 1;
                }
            }
        }
    }

    const checkFullFieldForNeighboringCrowns = () => {
        for (let x = 0; x < gameState.level.length; x++) {
            for (let y = 0; y < gameState.level[0].length; y++) {
                if (checkNeighborCellForCrowns(x, y)) {
                    gameState.error[x][y] = 1;
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
            alert("You win!");
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
    }

    useEffect(() => {
        for (let i = 0; i < gameState.height; i++) {
            if (countCrownsInRegion(i) > 1) {
                markRegionAsError(i, 1);
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
                <GameField gameState={gameState} onCellClick={handleCellClick} />
            </BaseWindow>
        </>
    )
}

export default App
