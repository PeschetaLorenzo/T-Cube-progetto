<script setup>
import { computed, ref } from 'vue'
import { solverMockSolution } from '@/data/tutorial/solverMock'
import { cubeStateFromScramble, cubeToState, SOLVED_STATE } from '@/js/cube'
import CubeInput from './CubeInput.vue'
import SolverControls from './SolverControls.vue'
import SolverMoveList from './SolverMoveList.vue'
import SolverStepViewer from './SolverStepViewer.vue'

const cubeState = ref(solverMockSolution.inputState)
const scramble = ref(solverMockSolution.scramble)
const moves = ref([])
const activeIndex = ref(0)
const solverError = ref('')
const solutionSource = ref('')
const previewSetup = ref('')

const currentSummary = computed(() => {
    return moves.value.length > 0
        ? `Soluzione generata da ${solutionSource.value}.`
        : 'Inserisci uno stato o uno scramble e genera una soluzione reale con la libreria Cube.'
})

function movesToSteps(solution) {
    return solution
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((move, index) => ({
            id: `solution-${index}-${move}`,
            move,
            label: `Applica ${move} alla posizione corrente`,
            phase: 'Soluzione'
        }))
}

function cleanState(state) {
    return String(state ?? '').replace(/\s+/g, '').toUpperCase()
}

function solveCube(payload = {}) {
    solverError.value = ''

    try {
        const selectedScramble = String(payload.scramble ?? scramble.value).trim()
        const useScramble = payload.source === 'scramble' || (!payload.source && selectedScramble)
        const state = useScramble
            ? cubeStateFromScramble(selectedScramble)
            : cleanState(payload.cubeState ?? cubeState.value)

        if (state.length !== 54 || /[^URFDLB]/.test(state)) {
            throw new Error('Cube state non valido: servono 54 caratteri tra U, R, F, D, L, B.')
        }

        const solution = cubeToState(state)

        if (solution === null) {
            throw new Error('Il cubo non risulta risolvibile.')
        }

        cubeState.value = state
        previewSetup.value = useScramble ? selectedScramble : ''
        solutionSource.value = useScramble ? 'scramble importato' : 'cube state'
        moves.value = solution.trim() ? movesToSteps(solution) : []
        activeIndex.value = 0

        if (moves.value.length === 0 && state === SOLVED_STATE) {
            solverError.value = 'Il cubo è già risolto.'
        }
    } catch (err) {
        moves.value = []
        activeIndex.value = 0
        previewSetup.value = ''
        solverError.value = err.message || 'Impossibile generare la soluzione.'
    }
}

function loadMock() {
    moves.value = [...solverMockSolution.moves]
    activeIndex.value = 0
    previewSetup.value = solverMockSolution.scramble
    solutionSource.value = 'mock'
    solverError.value = ''
}

function previousMove() {
    activeIndex.value = Math.max(0, activeIndex.value - 1)
}

function nextMove() {
    activeIndex.value = Math.min(moves.value.length - 1, activeIndex.value + 1)
}

function resetMoves() {
    activeIndex.value = 0
}

function selectMove(index) {
    activeIndex.value = index
}
</script>

<template>
    <section class="solver-panel">
        <div class="solver-intro">
            <span>Struttura solver</span>
            <h2>Risolutore step-by-step</h2>
            <p>{{ currentSummary }}</p>
        </div>

        <div class="solver-grid">
            <CubeInput
                v-model:cubeState="cubeState"
                v-model:scramble="scramble"
                @solve="solveCube"
            />

            <div class="solution-area">
                <p v-if="solverError" class="solver-error" role="alert">{{ solverError }}</p>
                <SolverStepViewer :moves="moves" :activeIndex="activeIndex" :setupAlgorithm="previewSetup" :cube_State="cubeState" />
                <SolverControls
                    :activeIndex="activeIndex"
                    :totalMoves="moves.length"
                    @previous="previousMove"
                    @next="nextMove"
                    @reset="resetMoves"
                />
                <SolverMoveList :moves="moves" :activeIndex="activeIndex" @select="selectMove" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.solver-panel {
    display: grid;
    gap: 1rem;
}

.solver-intro {
    display: grid;
    gap: 0.35rem;
}

.solver-intro span {
    color: var(--vueGreen);
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.78rem;
}

h2 {
    margin: 0;
    color: var(--color-heading);
}

p {
    margin: 0;
    line-height: 1.55;
}

.solver-grid {
    display: grid;
    grid-template-columns: minmax(270px, 0.8fr) minmax(0, 1.2fr);
    gap: 1rem;
}

.solution-area {
    min-width: 0;
    display: grid;
    gap: 0.85rem;
}

.solver-error {
    margin: 0;
    padding: 0.7rem 0.85rem;
    border: 1px solid rgba(245, 158, 11, 0.45);
    border-radius: 8px;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.08);
    font-weight: 800;
}

.mock-btn {
    justify-self: start;
    min-height: 2.2rem;
    padding: 0 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background-soft);
    font-weight: 800;
    cursor: pointer;
}

.mock-btn:hover,
.mock-btn:focus-visible {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
    outline: none;
}

@media (max-width: 980px) {
    .solver-grid {
        grid-template-columns: 1fr;
    }
}
</style>
