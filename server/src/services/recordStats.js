export function isSolveDnf(solve) {
    return Boolean(solve?.isdnf || solve?.isDnf || solve?.isDNF || solve?.penalties?.dnf || solve?.penalties?.DNF);
}

export function getSolveTimeWithPenalties(solve) {
    if (isSolveDnf(solve)) {
        return Infinity;
    }

    return Number(solve.tempo) +
        (solve.falloispezione ? 2000 : 0) +
        (solve.fallomossa ? 2000 : 0);
}

// Calcola il valore di un record partendo da una lista di solve.
// nsolve=1 restituisce il single; ao5/ao12 rimuovono best e worst; ao3 tiene tutti i tempi.
export function calculateRecordValue(solves, nsolve) {
    if (!Array.isArray(solves) || solves.length < nsolve) {
        return null;
    }

    if (nsolve === 1) {
        return getSolveTimeWithPenalties(solves[0]);
    }

    const tempi = solves
        .slice(0, nsolve)
        .map(solve => getSolveTimeWithPenalties(solve))
        .sort((a, b) => a - b);

    if (nsolve !== 3) {
        tempi.shift();
        tempi.pop();
    }

    const somma = tempi.reduce((acc, tempo) => acc + tempo, 0);
    return Math.round(somma / tempi.length);
}
