import cubeSource from '../../lib/cube.js?raw'
import solveSource from '../../lib/solve.js?raw'


const SCRAMBLE_MOVES = [
  ['u1', 'u2', 'u3'],
  ['f1', 'f2', 'f3'],
  ['r1', 'r2', 'r3'],
  ['l1', 'l2', 'l3'],
  ['b1', 'b2', 'b3'],
  ['d1', 'd2', 'd3']
]

export function generateScramble(length) {
  const scramble = []
  let prevFace = (Math.random() * SCRAMBLE_MOVES.length) | 0
  let oppositeFaceGuard = prevFace + 1

  scramble.push(SCRAMBLE_MOVES[prevFace][(Math.random() * 3) | 0])

  while (scramble.length < length) {
    let nextFace = (Math.random() * SCRAMBLE_MOVES.length) | 0

    while (nextFace === prevFace) {
      nextFace = (Math.random() * SCRAMBLE_MOVES.length) | 0
    }

    if (oppositeFaceGuard === 0) {
      if (nextFace === 5 - prevFace) {
        while (nextFace === prevFace || nextFace === 5 - prevFace) {
          nextFace = (Math.random() * SCRAMBLE_MOVES.length) | 0
        }
      }
      oppositeFaceGuard = nextFace + 1
    } else if (oppositeFaceGuard + nextFace === 6) {
      oppositeFaceGuard = 0
    } else {
      oppositeFaceGuard = nextFace + 1
    }

    scramble.push(SCRAMBLE_MOVES[nextFace][(Math.random() * 3) | 0])
    prevFace = nextFace
  }

  return scramble
}

export function displayScramble(scramble) {
  return scramble.map((move) => {
    const normalizedMove = move.toLowerCase()
    const face = normalizedMove[0].toUpperCase()
    const amount = normalizedMove[1]

    if (amount === '3' || amount === "'") return `${face}'`
    if (amount === '2') return `${face}2`

    return face
  })
}

export function parseScramble(scrambleString) {
  return scrambleString
    .trim()
    .replaceAll("'", '3')
    .toLowerCase()
    .split(/\s+/)
    .map((move) => (move.length === 1 ? `${move}1` : move))
}

const Cube = loadCubeLibrary()

// Stato standard del cubo risolto nel formato richiesto da Cube.fromString().
// L'ordine delle facce e: U, R, F, D, L, B, ognuna con 9 caratteri.
export const SOLVED_STATE = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'

// Il solver deve costruire alcune tabelle interne prima di poter risolvere.
// Questa variabile evita di ricalcolarle ogni volta che viene chiamata cubeToState().
let solverInitialized = false

function loadCubeLibrary() {
  const cubeModule = { exports: {} }
  const cubeContext = {}
  new Function('module', 'exports', cubeSource).call(cubeContext, cubeModule, cubeModule.exports)

  const loadedCube = cubeModule.exports || cubeContext.Cube

  if (!loadedCube) {
    throw new Error('Cube.js non e stato caricato correttamente.')
  }

  const solveModule = { exports: {} }
  const solveContext = { Cube: loadedCube }
  const requireCube = (path) => {
    if (path === './cube' || path === './cube.js') {
      return loadedCube
    }

    throw new Error(`Modulo non supportato richiesto da solve.js: ${path}`)
  }

  new Function('module', 'exports', 'require', solveSource).call(
    solveContext,
    solveModule,
    solveModule.exports,
    requireCube
  )

  return loadedCube
}

// Controlla che sia disponibile anche il solver e lo inizializza una sola volta.
// cube.js gestisce mosse e stati, mentre solve.js aggiunge Cube.prototype.solve()
// e Cube.initSolver(), necessari per calcolare le mosse di soluzione.
function requireSolver() {
  if (typeof Cube.prototype.solve !== 'function' || typeof Cube.initSolver !== 'function') {
    throw new Error('Il solver non e caricato correttamente.')
  }

  if (!solverInitialized) {
    Cube.initSolver()
    solverInitialized = true
  }
}

// Converte una stringa di stato in un oggetto Cube.js.
// Accetta solo stringhe per mantenere l'API semplice: chi usa playMoves() o
// cubeToState() deve passare lo stato del cubo, non direttamente un oggetto Cube.
function stateToCube(state, name) {
  if (typeof state !== 'string') {
    throw new Error(`${name} deve essere una stringa di stato del cubo.`)
  }

  const cleanState = state.replace(/\s+/g, '')

  if (!cleanState) {
    throw new Error(`${name} non valido.`)
  }

  if (cleanState.length !== 54) {
    throw new Error(`${name} deve contenere esattamente 54 facce.`)
  }

  return Cube.fromString(cleanState)
}

// Unisce due sequenze di mosse evitando spazi inutili quando una delle due e vuota.
function joinMoves(first, second) {
  return [first, second].filter(Boolean).join(' ')
}

// Applica una sequenza di mosse a uno stato del cubo.
export function playMoves(cubeState, moves) {
  const movedCube = stateToCube(cubeState, 'Lo stato del cubo')
  return movedCube.move(moves || '')
}

// Converte un'istanza Cube.js nella stringa di stato del cubo.
export function cubestateFromCube(cube) {
  if (!cube || typeof cube.asString !== 'function') {
    throw new Error('Il cubo deve essere un istanza Cube valida.')
  }

  return cube.asString()
}

export function cubeStateFromScramble(scramble) {
  return playMoves(SOLVED_STATE, scramble).asString()
}

// Calcola le mosse necessarie per portare un cubo da uno stato iniziale a uno
// stato finale. Se finalState non viene passato, calcola la soluzione classica.
export function cubeToState(cubeState, finalState = SOLVED_STATE) {
  requireSolver()

  const startCube = stateToCube(cubeState, 'Lo stato del cubo')
  const targetCube = stateToCube(finalState, 'Lo stato finale')
  const toSolved = startCube.solve()
  const targetToSolved = targetCube.solve()

  if (toSolved === null || targetToSolved === null) {
    return null
  }

  return joinMoves(toSolved/*, Cube.inverse(targetToSolved)*/)
}
