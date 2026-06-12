<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { useTrainingTimer } from '@/composables/useTrainingTimer'
import FormAlert from '@/components/utilities/FormAlert.vue'
import TrainingAlgorithmSidebar from './TrainingAlgorithmSidebar.vue'
import TrainingCubePreview from './TrainingCubePreview.vue'
import TrainingTimerPanel from './TrainingTimerPanel.vue'

const training = useTrainingStore()
const lastSolveMs = ref(null)
const sidebarOpen = ref(false)

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

function closeSidebar() {
    sidebarOpen.value = false
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

async function handleAuthUpdated() {
    trainingTimer.reset()
    lastSolveMs.value = null
    await training.refreshUserStats()
}

onMounted(async () => {
    if (training.tipiAlgoritmo.length === 0) {
        await training.loadTypes()
    } else {
        await training.refreshUserStats()
    }

    await training.applyTutorialTrainingRequest()
    window.addEventListener('auth-updated', handleAuthUpdated)
})

onBeforeUnmount(() => {
    training.stopTraining()
    window.removeEventListener('auth-updated', handleAuthUpdated)
    document.body.classList.remove('no-scroll')
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

watch(sidebarOpen, (open) => {
    document.body.classList.toggle('no-scroll', open)
})
</script>

<template>
    <main class="training-page">
        <div v-if="sidebarOpen" class="training-backdrop" @click="closeSidebar"></div>

        <aside :class="['training-sidebar-drawer', { open: sidebarOpen }]">
            <div class="mobile-sidebar-head">
                <strong>Algoritmi</strong>
                <button type="button" aria-label="Chiudi algoritmi" @click="closeSidebar">x</button>
            </div>
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
        </aside>

        <section class="training-workspace">
            <div class="mobile-training-toolbar">
                <button type="button" @click="sidebarOpen = true">
                    Algoritmi {{ selectedCount }}/{{ totalAlgorithms }}
                </button>
            </div>

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
                :fallbackImage="currentAlgorithm?.imgpath"
                :alt="'Caso training'"
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

.training-sidebar-drawer {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
}

.mobile-sidebar-head,
.mobile-training-toolbar,
.training-backdrop {
    display: none;
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

.mobile-training-toolbar button,
.mobile-sidebar-head button {
    min-height: 2.35rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    background: var(--color-background-soft);
    font-weight: 800;
    cursor: pointer;
}

.stats-strip span {
    color: var(--color-text);
    font-size: 0.82rem;
    font-weight: 700;
    opacity: 0.72;
    text-transform: uppercase;
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
        grid-template-columns: 1fr;
    }

    .training-sidebar-drawer {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: var(--z-drawer);
        width: min(92vw, var(--sidebar-width));
        height: 100dvh;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: var(--color-background);
        border-right: 1px solid var(--color-border);
        transform: translateX(-105%);
        transition: transform var(--transition-fast);
    }

    .training-sidebar-drawer.open {
        transform: translateX(0);
    }

    .training-backdrop {
        position: fixed;
        inset: 0;
        z-index: var(--z-overlay);
        display: block;
        background: rgba(0, 0, 0, 0.44);
    }

    .mobile-sidebar-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .mobile-sidebar-head strong {
        color: var(--color-heading);
        font-weight: 900;
    }

    .mobile-sidebar-head button {
        width: 2.35rem;
    }

    .mobile-training-toolbar {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .mobile-training-toolbar button {
        width: min(100%, 16rem);
    }

    .training-workspace {
        min-height: calc(100dvh - 12rem);
    }
}

@media (max-width: 620px) {
    .stats-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 900px) and (orientation: landscape) {
    .training-workspace {
        gap: 0.55rem;
        min-height: auto;
    }
}
</style>
