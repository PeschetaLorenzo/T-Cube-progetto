<script setup>
defineProps({
    moves: {
        type: Array,
        default: () => []
    },
    activeIndex: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['select'])
</script>

<template>
    <section class="move-list" aria-label="Lista mosse soluzione">
        <button
            v-for="(item, index) in moves"
            :key="item.id"
            type="button"
            :class="{ active: index === activeIndex }"
            @click="emit('select', index)"
        >
            <span>{{ index + 1 }}</span>
            <strong>{{ item.move }}</strong>
            <small>{{ item.phase }}</small>
        </button>
    </section>
</template>

<style scoped>
.move-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(86px, 1fr));
    gap: 0.5rem;
}

button {
    min-width: 0;
    display: grid;
    gap: 0.15rem;
    padding: 0.55rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-background-soft);
    cursor: pointer;
}

button:hover,
button:focus-visible,
button.active {
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.1);
    outline: none;
}

span,
small {
    opacity: 0.7;
    font-size: 0.75rem;
}

strong {
    color: var(--color-heading);
    font-family: monospace;
    font-size: 1.05rem;
}
</style>
