<script setup>
import { computed } from 'vue'
import { cubestateFromCube, displayScramble, playMoves } from '@/js/cube.js'
import TutorialCubePreview from '../TutorialCubePreview.vue'

const props = defineProps({
    // Lista ordinata delle mosse della soluzione. Ogni elemento deve contenere
    // almeno la proprieta `move`, per esempio `{ move: 'R' }` o `{ move: "U'" }`.
    moves: {
        type: Array,
        default: () => []
    },
    // Indice della mossa attualmente selezionata: la preview mostra le mosse
    // da `moves[0]` fino a `moves[activeIndex]`.
    activeIndex: {
        type: Number,
        default: 0
    },
    // Algoritmo opzionale da applicare prima delle mosse della soluzione,
    // usato per preparare il cubo nello stato iniziale della dimostrazione.
    setupAlgorithm: {
        type: String,
        default: ''
    },
    // Stato iniziale del cubo in formato cubeState da 54 caratteri
    // nell'ordine U, R, F, D, L, B.
    cube_State: {
        type: String,
        default: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
    }
})

const movesScramble = computed(() => {
    return displayScramble(props.moves.map(el => el.move)).toString().replaceAll(',', ' ')
})

const previewAlgorithm = computed(() => {
    const solutionMoves = props.moves
        .slice(0, props.activeIndex + 1)
        .map(item => item.move)
        .join(' ')


    return [solutionMoves]
        .filter(Boolean).join(' ')
})
</script>

<template>
    <section class="step-viewer" aria-label="Step solver">
        <TutorialCubePreview :algorithm="previewAlgorithm.split(' ')[props.activeIndex]" alt="Mossa solver corrente" :cube-state="cubestateFromCube(playMoves(cube_State, previewAlgorithm.slice(0, -2)))" />

        <div class="step-copy">
            <span>Solver</span>
            <h3>{{ movesScramble == '[]' ? '':movesScramble }}</h3>
            <p>Genera una soluzione mock per vedere gli step.</p>
        </div>
    </section>
</template>

<style scoped>
.step-viewer {
    display: grid;
    grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: stretch;
}

.step-copy {
    display: grid;
    align-content: center;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
}

span {
    color: var(--vueGreen);
    font-size: 0.78rem;
    font-weight: 900;
    text-transform: uppercase;
}

h3 {
    margin: 0;
    color: var(--color-heading);
    font-family: monospace;
    font-size: 2rem;
}

p {
    margin: 0;
    line-height: 1.5;
}

@media (max-width: 760px) {
    .step-viewer {
        grid-template-columns: 1fr;
    }
}
</style>
