<script setup>
    const props = defineProps({
        training: {type: Object, default: {}},
        guideMessage: {type: String, default: ''},
        selectedCount: {type: Number, default: null},
        startTraining: {type: Function, default: () =>{}},
        stopTraining: {type: Function, default: () =>{}}
    })
</script>

<template>
    <div class="top-row">
        <section class="scramble-panel">
            <span>Scramble {{ training.currentAlgorithm ? '- ' + training.currentAlgorithm.descAlg : '' }}</span>
            <strong v-if="training.currentScramble">{{ training.currentScramble }}</strong>
            <p v-else>{{ guideMessage }}</p>
        </section>

        <div class="training-actions">
            <button
                type="button"
                :disabled="training.loadingAlgorithms || selectedCount === 0 || training.isTrainingActive"
                @click="startTraining"
            >
                Start
            </button>
            <button
                type="button"
                :disabled="!training.isTrainingActive"
                @click="stopTraining"
            >
                Stop
            </button>
        </div>
    </div>
</template>
<style scoped>
.top-row {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: stretch;
    gap: 0.75rem;
}

.scramble-panel {
    margin-left: 1rem;
    min-width: 0rem;
    min-height: 5rem;
    width: 50vw;
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

@media (max-width: 900px) {

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

</style>
