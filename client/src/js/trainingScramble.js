const AUF_MOVES = ['', 'U', "U'", 'U2']

const MOVE_SEPARATOR = /[\s,;]+/
const CLEAN_TOKEN_CHARS = /^[([{\s]*(.*?)[)\]}\s]*$/
const MOVE_PATTERN = /^([URFDLBMESXYZurfdlbmesxyz])([wW]?)(2?)(['’]?)$/

function sanitizeToken(token) {
    return token
        .trim()
        .replace(/[’]/g, "'")
        .match(CLEAN_TOKEN_CHARS)?.[1]
        ?.trim()
}

function isLowerWideFace(face) {
    return /^[urfdlb]$/.test(face)
}

function normalizeMove(token) {
    const cleanToken = sanitizeToken(token)

    if (!cleanToken) {
        return null
    }

    const match = cleanToken.match(MOVE_PATTERN)

    if (!match) {
        throw new Error(`Mossa non supportata: ${token}`)
    }

    const rawFace = match[1]
    const explicitWide = match[2].toLowerCase() === 'w'
    const amount = match[3] === '2' ? '2' : ''
    const prime = amount === '2' ? '' : match[4].replace('’', "'")
    const wide = explicitWide || isLowerWideFace(rawFace)
    const face = rawFace.toUpperCase()

    if (wide && !'URFDLB'.includes(face)) {
        throw new Error(`Wide move non valida: ${token}`)
    }

    return {
        face,
        wide,
        suffix: amount || prime
    }
}

function moveToString(move) {
    return `${move.face}${move.wide ? 'w' : ''}${move.suffix}`
}

function inverseSuffix(suffix) {
    if (suffix === '2') {
        return '2'
    }

    return suffix === "'" ? '' : "'"
}

function inverseMove(move) {
    return {
        ...move,
        suffix: inverseSuffix(move.suffix)
    }
}

function parseAlgorithm(algorithm) {
    if (Array.isArray(algorithm)) {
        return algorithm.map(normalizeMove).filter(Boolean)
    }

    if (typeof algorithm !== 'string' || algorithm.trim() === '') {
        throw new Error('Algoritmo vuoto')
    }

    return algorithm
        .split(MOVE_SEPARATOR)
        .map(normalizeMove)
        .filter(Boolean)
}

function randomAuf() {
    return AUF_MOVES[(Math.random() * AUF_MOVES.length) | 0]
}

export function invertAlgorithm(algorithm) {
    return parseAlgorithm(algorithm)
        .reverse()
        .map(inverseMove)
        .map(moveToString)
}

export function generateTrainingScramble(algorithm, options = {}) {
    const inverseMoves = invertAlgorithm(algorithm)
    const auf = options.auf === undefined ? randomAuf() : options.auf
    const scrambleMoves = auf ? [...inverseMoves, auf] : inverseMoves

    return {
        moves: scrambleMoves,
        scramble: scrambleMoves.join(' '),
        auf
    }
}

function simpleMove(face, suffix = '') {
    return `${face}${suffix}`
}

function expandClockwiseMove(move) {
    if (!move.wide && 'URFDLBMES'.includes(move.face)) {
        return [simpleMove(move.face)]
    }

    if (move.wide) {
        switch (move.face) {
            case 'R':
                return ['R', "M'"]
            case 'L':
                return ['L', 'M']
            case 'U':
                return ['U', "E'"]
            case 'D':
                return ['D', 'E']
            case 'F':
                return ['F', 'S']
            case 'B':
                return ['B', "S'"]
        }
    }

    switch (move.face) {
        case 'X':
            return ['R', "M'", "L'"]
        case 'Y':
            return ['U', "E'", "D'"]
        case 'Z':
            return ['F', 'S', "B'"]
        default:
            throw new Error(`Mossa non renderizzabile: ${moveToString(move)}`)
    }
}

function invertSimpleMove(move) {
    if (move.endsWith('2')) {
        return move
    }

    return move.endsWith("'")
        ? move.slice(0, -1)
        : `${move}'`
}

function expandWithSuffix(move) {
    const clockwise = expandClockwiseMove(move)

    if (move.suffix === '2') {
        return [...clockwise, ...clockwise]
    }

    if (move.suffix === "'") {
        return [...clockwise].reverse().map(invertSimpleMove)
    }

    return clockwise
}

export function toRendererMoves(moves) {
    return parseAlgorithm(moves).flatMap(expandWithSuffix)
}
