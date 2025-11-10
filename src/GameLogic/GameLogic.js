export const fieldHasErrors = (gameState) => {
    for (let x = 0; x < gameState.level.length; x++) {
        for (let y = 0; y < gameState.level[0].length; y++) {
            if (gameState.error[x][y] === 1) {
                return true;
            }
        }
    }

    return false;
}

export const countCrownsInField = (gameState) => {
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

export const countCrownsInRegion = (gameState, region) => {
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
export const checkNeighborCellForCrowns = (gameState, x, y) => {
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

export const checkRowForMultipleCrowns = (gameState, row) => {
    let crownCount = 0;
    for (let y = 0; y < gameState.width; y++) {
        if (gameState.field[row][y] === 2) {
            crownCount++;
        }
    }
    return crownCount > 1;
}

export const checkColumnForMultipleCrowns = (gameState, col) => {
    let crownCount = 0;
    for (let x = 0; x < gameState.height; x++) {
        if (gameState.field[x][col] === 2) {
            crownCount++;
        }
    }
    return crownCount > 1;
}
