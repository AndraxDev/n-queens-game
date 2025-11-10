import { generateZero2dArray } from "../GameLogic/GameLevelGenerator.js"

const vercelLevel1 = {
    size: 6,
    colorRegions: [
        ["D", "A", "A", "A", "A", "A"],
        ["D", "B", "E", "E", "E", "B"],
        ["D", "B", "C", "D", "F", "B"],
        ["D", "B", "F", "E", "F", "B"],
        ["D", "A", "A", "A", "F", "B"],
        ["C", "C", "C", "C", "C", "B"],
    ],
    regionColors: {
        A: null,
        B: null,
        C: null,
        D: null,
        E: null,
        F: null,
    },
    isNew: true,
};

const convertLetterToNumber = (l) => {
    return l.charCodeAt(0) - 'A'.charCodeAt(0);
}

const convertVercelArray = (a) => {
    let b = [];

    for (let i = 0; i < a.length; i++) {
        b.push([])
        for (let j = 0; j < a[0].length; j++) {
            b[i].push(convertLetterToNumber(a[i][j]));
        }
    }

    return b;
}

const convertVercelLevelToRegular = (level) => {
    return {
        width: level.size,
        height: level.size,
        level: convertVercelArray(level.colorRegions),
        field: generateZero2dArray(8, 8),
        error: generateZero2dArray(8, 8)
    }
}

export const level1 = {
    width: 8,
    height: 8,
    level: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 7, 7, 7, 7, 7],
        [1, 2, 0, 0, 0, 0, 7, 7],
        [1, 2, 2, 2, 4, 0, 5, 7],
        [1, 1, 2, 4, 4, 0, 5, 7],
        [1, 7, 2, 3, 3, 6, 6, 7],
        [1, 7, 7, 3, 3, 6, 7, 7],
        [1, 1, 7, 7, 7, 7, 7, 7]
    ],
    field: generateZero2dArray(8, 8),
    error: generateZero2dArray(8, 8)
}

export const level1Solution = [
    [-1, -1,  0, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1,  7],
    [-1,  2, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1,  4, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1,  5, -1],
    [-1, -1, -1,  3, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1,  6, -1, -1],
    [ 1, -1, -1, -1, -1, -1, -1, -1]
]