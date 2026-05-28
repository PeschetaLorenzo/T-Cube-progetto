<script setup>
defineProps({
    activeIndex: {
        type: Number,
        default: 0
    },
    totalMoves: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['previous', 'next', 'reset'])
</script>

<template>
    <section class="solver-controls" aria-label="Controlli soluzione">
        <button type="button" :disabled="activeIndex <= 0" @click="emit('previous')">Indietro</button>
        <span>{{ totalMoves === 0 ? 0 : activeIndex + 1 }} / {{ totalMoves }}</span>
        <button type="button" :disabled="activeIndex >= totalMoves - 1" @click="emit('next')">Avanti</button>
        <button type="button" :disabled="totalMoves === 0" @click="emit('reset')">Reset</button>
    </section>
</template>

<style scoped>
.solver-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

button {
    min-height: 2.2rem;
    padding: 0 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background-soft);
    font-weight: 800;
    cursor: pointer;
}

button:hover:not(:disabled),
button:focus-visible:not(:disabled) {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
    outline: none;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

span {
    min-width: 4.5rem;
    color: var(--color-heading);
    font-weight: 900;
    text-align: center;
}
</style>
