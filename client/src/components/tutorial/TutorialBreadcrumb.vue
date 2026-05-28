<script setup>
defineProps({
    category: {
        type: Object,
        default: null
    },
    section: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['home', 'category'])
</script>

<template>
    <nav class="breadcrumb" aria-label="Percorso tutorial">
        <button type="button" @click="emit('home')">Tutorial</button>
        <span v-if="category" aria-hidden="true">/</span>
        <button v-if="category" type="button" @click="emit('category')">
            {{ category.title }}
        </button>
        <span v-if="section" aria-hidden="true">/</span>
        <strong v-if="section">{{ section.title }}</strong>
    </nav>
</template>

<style scoped>
.breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.45rem;
    color: var(--color-text);
    font-size: 0.9rem;
}

button {
    border: 0;
    padding: 0;
    color: var(--vueGreen);
    background: transparent;
    font-weight: 800;
    cursor: pointer;
}

button:focus-visible {
    outline: 2px solid var(--vueGreen);
    outline-offset: 3px;
}

strong {
    color: var(--color-heading);
}
</style>
