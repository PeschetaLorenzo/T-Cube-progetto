<script setup>
defineProps({
    previousSection: {
        type: Object,
        default: null
    },
    nextSection: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['previous', 'next'])
</script>

<template>
    <nav class="tutorial-navigation" aria-label="Navigazione sezioni">
        <button type="button" :disabled="!previousSection" @click="emit('previous')">
            <span>Precedente</span>
            <strong>{{ previousSection?.title ?? '-' }}</strong>
        </button>
        <button type="button" :disabled="!nextSection" @click="emit('next')">
            <span>Successiva</span>
            <strong>{{ nextSection?.title ?? '-' }}</strong>
        </button>
    </nav>
</template>

<style scoped>
.tutorial-navigation {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
}

button {
    min-width: 0;
    display: grid;
    gap: 0.25rem;
    padding: 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-background-soft);
    cursor: pointer;
    text-align: left;
}

button:last-child {
    text-align: right;
}

button:hover:not(:disabled),
button:focus-visible:not(:disabled) {
    border-color: var(--vueGreen);
    outline: none;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

span {
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    opacity: 0.7;
}

strong {
    overflow-wrap: anywhere;
    color: var(--color-heading);
}
</style>
