const randomSafePermutation = (n, rng = Math.random) => {
    if (!Number.isInteger(n) || n <= 0) throw new Error("n must be a positive integer.");
    if (n === 2 || n === 3) throw new Error("No valid layout exists for n = 2 or 3.");

    // Fisher–Yates shuffle (in-place)
    const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const perm = new Array(n);
    const unused = new Set(Array.from({ length: n }, (_, i) => i));

    // backtracking with forward-checking
    function dfs(row, lastCol) {
        if (row === n) return true;

        // build candidate list for this row
        const candidates = [];
        for (const c of unused) {
            if (lastCol == null || Math.abs(c - lastCol) >= 2) candidates.push(c);
        }

        // small heuristic: try more "central" columns later (keeps options);
        // but mainly we randomize the order for unpredictability.
        shuffle(candidates);

        for (const c of candidates) {
            // place
            perm[row] = c;
            unused.delete(c);

            // forward-check: ensure next row will have at least one option
            let okNext = true;
            if (row + 1 < n) {
                let anyNext = false;
                for (const nc of unused) {
                    if (Math.abs(nc - c) >= 2) { anyNext = true; break; }
                }
                okNext = anyNext;
            }

            if (okNext && dfs(row + 1, c)) return true;

            // undo
            unused.add(c);
            perm[row] = undefined;
        }
        return false;
    }

    // Try until success (should succeed fast for n ≥ 4)
    while (!dfs(0, null)) {
        // re-seed order by reshuffling the initial unused set
        unused.clear();
        for (let i = 0; i < n; i++) unused.add(i);
    }
    return perm;
}

/**
 * Make an n×n grid filled with -1 and place seeds 0..n-1
 * according to a random safe permutation.
 */
export const generateRandomSeedsGrid = (n, rng = Math.random) => {
    const p = randomSafePermutation(n, rng);
    const grid = Array.from({ length: n }, () => Array(n).fill(-1));
    for (let r = 0; r < n; r++) grid[r][p[r]] = r;
    return grid;
}