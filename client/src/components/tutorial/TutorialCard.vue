<script setup>
defineProps({
    category: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['select'])
</script>

<template>
    <button class="tutorial-card" type="button" @click="emit('select', category.id)">
        <span class="card-icon" aria-hidden="true">{{ category.icon }}</span>
        <span class="card-copy">
            <strong>{{ category.title }}</strong>
            <span>{{ category.description }}</span>
        </span>
    </button>
</template>

<style scoped>
.tutorial-card {
    min-height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-background-soft);
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.2s,
        background-color 0.2s,
        transform 0.2s;
}

.tutorial-card:hover,
.tutorial-card:focus-visible {
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.1);
    transform: translateY(-3px);
    outline: none;
}

.card-icon {
    width: 3rem;
    height: 3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: var(--vueGreen);
    border: 1px solid var(--color-border);
    background: var(--color-background);
    font-weight: 900;
    letter-spacing: 0;
}

.card-copy {
    display: grid;
    gap: 0.45rem;
}

strong {
    color: var(--color-heading);
    font-size: 1.25rem;
}

span span {
    line-height: 1.45;
    opacity: 0.82;
}
</style>
