<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { useTrainingTimer } from '@/composables/useTrainingTimer'
import FormAlert from '@/components/utilities/FormAlert.vue'
import TrainingAlgorithmSidebar from './TrainingAlgorithmSidebar.vue'
import TrainingCubePreview from './TrainingCubePreview.vue'
import TrainingTimerPanel from './TrainingTimerPanel.vue'
import TrainingHeader from '../header/trainingHeader.vue'

const training = useTrainingStore()
const lastSolveMs = ref(null)

const timerEnabled = computed(() => {
    return training.isTrainingActive
        && Boolean(training.currentScramble)
        && !training.loadingAlgorithms
})

const trainingTimer = useTrainingTimer({
    enabled: () => timerEnabled.value,
    onStop: async (tempo) => {
        lastSolveMs.value = Math.round(tempo)
        await training.recordSolve(tempo)
        trainingTimer.reset()
    }
})

const { phase, formattedTime } = trainingTimer

const selectedCount = computed(() => training.selectedAlgorithmIds.length)
const totalAlgorithms = computed(() => training.algorithms.length)
const currentAlgorithm = computed(() => training.currentAlgorithm)
const renderKey = computed(() => `${training.currentAlgorithmId ?? 'empty'}-${training.currentScramble}`)

const selectedStats = computed(() => {
    return training.algorithms
        .filter(algoritmo => training.selectedAlgorithmIds.includes(algoritmo.idAlg))
        .map(algoritmo => training.getStatsForAlgorithm(algoritmo.idAlg))
})

const totalSolves = computed(() => {
    return selectedStats.value.reduce((sum, stat) => sum + Number(stat.nSolves ?? 0), 0)
})

const bestTraining = computed(() => {
    const bests = selectedStats.value
        .map(stat => stat.best)
        .filter(value => value !== null && value !== undefined)

    return bests.length > 0 ? Math.min(...bests) : null
})

const mediaTraining = computed(() => {
    const stats = selectedStats.value.filter(stat => Number(stat.nSolves ?? 0) > 0 && stat.media !== null)
    const solves = stats.reduce((sum, stat) => sum + Number(stat.nSolves), 0)

    if (solves === 0) {
        return null
    }

    const weightedSum = stats.reduce((sum, stat) => {
        return sum + (Number(stat.media) * Number(stat.nSolves))
    }, 0)

    return weightedSum / solves
})

const guideMessage = computed(() => {
    if (training.loadingAlgorithms || training.loadingTypes) {
        return 'Caricamento dati training...'
    }

    if (totalAlgorithms.value === 0) {
        return 'Nessun algoritmo disponibile per questo tipo'
    }

    if (selectedCount.value === 0) {
        return 'Seleziona almeno un algoritmo dalla tabella laterale'
    }

    if (!training.isTrainingActive) {
        return 'Avvia il training per generare il primo caso'
    }

    return ''
})

function formatMs(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return '-'
    }

    return (Number(value) / 1000).toFixed(3)
}

async function onSelectType(idTipoAlg) {
    trainingTimer.reset()
    lastSolveMs.value = null
    await training.selectType(idTipoAlg)
}

function startTraining() {
    trainingTimer.reset()
    lastSolveMs.value = null
    training.startTraining()
}

function stopTraining() {
    training.stopTraining()
    trainingTimer.reset()
}

onMounted(() => {
    if (training.tipiAlgoritmo.length === 0) {
        training.loadTypes()
    }
})

onBeforeUnmount(() => {
    training.stopTraining()
})

watch(() => training.currentScramble, () => {
    if (phase.value !== 'running') {
        trainingTimer.reset()
    }
})

watch(selectedCount, (count) => {
    if (count === 0 && training.isTrainingActive) {
        stopTraining()
    }
})
</script>

<template>
    <main class="training-page">
        <TrainingAlgorithmSidebar
            :tipiAlgoritmo="training.tipiAlgoritmo"
            :selectedTypeId="training.selectedTypeId"
            :algorithms="training.algorithms"
            :selectedIds="training.selectedAlgorithmIds"
            :statsByAlg="training.statsByAlg"
            :currentAlgorithmId="training.currentAlgorithmId"
            :loading="training.loadingAlgorithms"
            :loadingTypes="training.loadingTypes"
            @selectType="onSelectType"
            @toggleAlgorithm="training.toggleAlgorithm"
            @selectAll="training.selectAllAlgorithms"
            @clearSelection="training.clearSelectedAlgorithms"
        />

        <section class="training-workspace">

            <FormAlert v-if="training.error" :message="training.error" type="error" />
            <FormAlert v-if="training.lastSaveError" :message="training.lastSaveError" type="warning" />

            <TrainingTimerPanel
                :phase="phase"
                :formattedTime="formattedTime"
                :lastSolveMs="lastSolveMs"
                :saving="training.saving"
                :enabled="timerEnabled"
            />
            
            <TrainingCubePreview
                :rendererMoves="training.currentRendererMoves"
                :fallbackImage="currentAlgorithm?.imagePath"
                :alt="'Caso training'"
                :renderKey="renderKey"
            />


            <section class="stats-strip">
                <div>
                    <span>Selezionati</span>
                    <strong>{{ selectedCount }}/{{ totalAlgorithms }}</strong>
                </div>
                <div>
                    <span>Best</span>
                    <strong>{{ formatMs(bestTraining) }}</strong>
                </div>
                <div>
                    <span>Media</span>
                    <strong>{{ formatMs(mediaTraining) }}</strong>
                </div>
                <div>
                    <span>Solve</span>
                    <strong>{{ totalSolves }}</strong>
                </div>
            </section>
        </section>
    </main>
</template>

<style scoped>
.training-page {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(300px, 390px) minmax(0, 1fr);
    gap: 1.25rem;
}

.training-workspace {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0.9rem;
    padding: 0.25rem 0 0.5rem;
}

.top-row {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: stretch;
    gap: 0.75rem;
}

.scramble-panel {
    min-width: 0;
    min-height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.65rem 0.85rem;
    border-left: 3px solid var(--vueGreen);
    background: var(--color-background-soft);
}

.scramble-panel span,
.stats-strip span {
    color: var(--color-text);
    font-size: 0.82rem;
    font-weight: 700;
    opacity: 0.72;
    text-transform: uppercase;
}

.scramble-panel strong {
    color: var(--color-heading);
    font-family: monospace;
    font-size: clamp(1.2rem, 2vw, 1.9rem);
    font-weight: 800;
    line-height: 1.25;
    overflow-wrap: anywhere;
}

.scramble-panel p {
    margin: 0;
    color: var(--color-text);
    opacity: 0.8;
}

.training-actions {
    display: flex;
    gap: 0.5rem;
}

.training-actions button {
    min-width: 5rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background-soft);
    font-weight: 800;
    transition:
        color 0.2s,
        border-color 0.2s,
        background-color 0.2s;
}

.training-actions button:hover:not(:disabled),
.training-actions button:focus-visible:not(:disabled) {
    color: var(--vueGreen);
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.12);
}

.training-actions button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.stats-strip {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
}

.stats-strip div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.65rem 0.85rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-background-soft);
}

.stats-strip strong {
    color: var(--color-heading);
    font-size: 1.2rem;
    font-weight: 800;
    overflow-wrap: anywhere;
}

@media (max-width: 900px) {
    .training-page {
        height: auto;
        grid-template-columns: 1fr;
    }

    .top-row {
        grid-template-columns: 1fr;
    }

    .training-actions {
        height: 2.5rem;
    }

    .training-actions button {
        flex: 1 1 0;
    }
}

@media (max-width: 620px) {
    .stats-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
