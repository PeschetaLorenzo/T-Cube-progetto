<script setup>
defineProps({
    phase: {
        type: String,
        required: true
    },
    formattedTime: {
        type: Object,
        required: true
    },
    lastSolveMs: {
        type: Number,
        default: null
    },
    saving: {
        type: Boolean,
        default: false
    },
    enabled: {
        type: Boolean,
        default: false
    }
})

function formatMs(value) {
    if (value === null || value === undefined) {
        return '-'
    }

    return (Number(value) / 1000).toFixed(3)
}
</script>

<template>
    <section class="timer-panel">
        <div
            class="timer-value"
            :class="{
                ready: phase === 'ready',
                running: phase === 'running',
                disabled: !enabled
            }"
        >
            {{ formattedTime.integer }}.<small>{{ formattedTime.decimal }}</small>
        </div>

        <div class="timer-status">
            <span v-if="!enabled">Avvia il training per usare il timer</span>
            <span v-else-if="phase === 'ready'">Rilascia spazio</span>
            <span v-else-if="phase === 'running'">Premi spazio per fermare</span>
            <span v-else>Tieni premuto spazio</span>
        </div>

        <div class="solve-info">
            <span>Ultima solve: {{ formatMs(lastSolveMs) }}</span>
            <span v-if="saving">Salvataggio...</span>
        </div>
    </section>
</template>

<style scoped>
.timer-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
}

.timer-value {
    font-family: monospace;
    font-size: clamp(4.8rem, 12vw, 10rem);
    line-height: 0.95;
    color: var(--color-text);
    transition: color 0.18s, opacity 0.18s;
}

.timer-value small {
    font-size: 0.72em;
}

.timer-value.ready {
    color: var(--vueGreen);
}

.timer-value.running {
    color: #e74c3c;
}

.timer-value.disabled {
    opacity: 0.45;
}

.timer-status {
    min-height: 1.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-heading);
}

.solve-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    min-height: 1.5rem;
    opacity: 0.8;
}

@media (max-width: 700px) {
    .timer-value {
        font-size: clamp(4rem, 19vw, 7rem);
    }
}

@media (max-width: 900px) and (orientation: landscape) {
    .timer-panel {
        gap: 0.25rem;
    }

    .timer-value {
        font-size: clamp(3.3rem, 17vh, 5.5rem);
    }

    .timer-status,
    .solve-info {
        font-size: 0.9rem;
    }
}
</style>
