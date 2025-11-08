import { generateZero2dArray } from "../GameLevelGenerator/GameLevelGenerator.js"

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