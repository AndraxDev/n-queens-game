import {generateRandomSeedsGrid} from "./SeedGenerator.js";

const FIELD_SIZE = 8;

export const getFieldSize = () => {
    return localStorage.getItem("fieldSize") ? parseInt(localStorage.getItem("fieldSize")) : FIELD_SIZE;
}

export const setFieldSize = (size) => {
    if (size < 6 || size > 12) {
        throw new Error("Field size must be between 5 and 12");
    }
    localStorage.setItem("fieldSize", size);
}

export const generateLevel = () => {
    let level = {
        width: getFieldSize(),
        height: getFieldSize(),
        level: generateCrowns(getFieldSize()),
        field: generateZero2dArray(getFieldSize(), getFieldSize()),
        error: generateZero2dArray(getFieldSize(), getFieldSize())
    }

    localStorage.setItem("gameState", JSON.stringify(level));

    return level;
}

const generateCrowns = (fieldWidthHeight) => {
    let seeds = generateRandomSeedsGrid(fieldWidthHeight);

    let a = copy2dArray(seeds);
    localStorage.setItem("seeds", JSON.stringify(a));
    // console.log("Correct crowns placement:");
    // console.log(a);

    return generateRegions(seeds);
}

export const generateZero2dArray = (width, height) => {
    let rows = [];

    for (let i = 0; i < height; i++) {
        let cols = [];

        for (let j = 0; j < width; j++) {
            cols.push(0);
        }

        rows.push(cols);
    }

    return rows;
}

const copy2dArray = (array) => {
    return array.map(row => row.slice());
}

const generateRegions = (grid, rng = Math.random) => {
    const n = grid.length;
    if (!Number.isInteger(n) || n <= 0 || !grid.every(row => row.length === n)) {
        throw new Error("Grid must be a non-empty square matrix.");
    }

    // Collect unique region ids present (>= 0)
    const regionSet = new Set();
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] >= 0) regionSet.add(grid[r][c]);
        }
    }
    const regions = Array.from(regionSet).sort((a, b) => a - b);

    // Sanity check: exactly n unique regions (per your spec)
    if (regions.length !== n) {
        throw new Error(`Expected ${n} unique region ids, got ${regions.length}.`);
    }

    // Helpers
    const inBounds = (r, c) => r >= 0 && r < n && c >= 0 && c < n;
    const DIRS = [
        [-1, 0], // up
        [1, 0],  // down
        [0, -1], // left
        [0, 1],  // right
    ];
    const randChoice = arr => arr[Math.floor(rng() * arr.length)];

    const hasUnfilled = () => {
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (grid[r][c] === -1) return true;
            }
        }
        return false;
    };

    // Return list of edge cells for a given region id:
    // An edge cell is a cell belonging to the region that has at least one -1 4-neighbor.
    function getEdgeCells(regionId) {
        const edges = [];
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (grid[r][c] !== regionId) continue;
                for (const [dr, dc] of DIRS) {
                    const nr = r + dr, nc = c + dc;
                    if (inBounds(nr, nc) && grid[nr][nc] === -1) {
                        edges.push([r, c]);
                        break; // this (r,c) is an edge; avoid duplicates
                    }
                }
            }
        }
        return edges;
    }

    // One expansion step for a single region:
    // 1) choose an edge cell of the region
    // 2) choose one -1 neighbor (4-dir) of that edge cell
    // 3) paint it with region id
    function expandOnce(regionId, regionNumbers, idMapping) {
        const edgeCells = getEdgeCells(regionId);
        if (edgeCells.length === 0) return false; // cannot expand now

        const [er, ec] = randChoice(edgeCells);
        const candidates = [];
        for (const [dr, dc] of DIRS) {
            const nr = er + dr, nc = ec + dc;
            if (inBounds(nr, nc) && grid[nr][nc] === -1) {
                candidates.push([nr, nc]);
            }
        }
        if (candidates.length === 0) return false; // should not happen due to edge definition
        const [tr, tc] = randChoice(candidates);
        // To avoid patterns and make first queens easier, use increasing probability function
        const randomProbabilityOfExpansion = Math.floor(Math.random() * 500 + ((500 / regionNumbers) * (idMapping[regionId] * 1.25)));
        if (randomProbabilityOfExpansion < 600) {
            grid[tr][tc] = regionId; // paint
        }
        return true;
    }

    const idMapping = [];

    for (let i = 0; i < regions.length; i++) {
        idMapping.push(i);
    }

    idMapping.sort(() => Math.random() - 0.5);

    // Main round-robin loop
    while (hasUnfilled()) {
        let progressedThisRound = false;
        for (const regionId of regions) {
            // Expand this region at most one cell this pass
            const regionNumbers = regions.length;
            const did = expandOnce(regionId, regionNumbers, idMapping);
            if (did) progressedThisRound = true;
            // Early exit if we’re done
            if (!hasUnfilled()) break;
        }
        // If nobody could expand but cells remain -1, the layout is unsatisfiable
        if (!progressedThisRound && hasUnfilled()) {
            throw new Error("Stuck: remaining -1 cells are not reachable by any region via 4-neighbors.");
        }
    }

    return grid;
}
