<script setup>
defineProps({
    category: {
        type: Object,
        required: true
    },
    sections: {
        type: Array,
        default: () => []
    },
    activeSectionId: {
        type: String,
        default: ''
    },
    open: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['select', 'close'])
</script>

<template>
    <aside :class="['tutorial-sidebar', { open }]" aria-label="Sezioni tutorial">
        <div class="sidebar-head">
            <div>
                <span>{{ category.icon }}</span>
                <strong>{{ category.title }}</strong>
            </div>
            <button type="button" class="close-btn" aria-label="Chiudi menu sezioni" @click="emit('close')">x</button>
        </div>

        <button
            v-for="section in sections"
            :key="section.id"
            type="button"
            :class="{ active: section.id === activeSectionId }"
            @click="emit('select', section.id)"
        >
            <strong>{{ section.title }}</strong>
            <span>{{ section.description }}</span>
        </button>
    </aside>
</template>

<style scoped>
.tutorial-sidebar {
    min-width: 280px;
    max-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    overflow-y: auto;
    padding-right: 0.25rem;
}

.sidebar-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
}

.sidebar-head div {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
}

.sidebar-head span {
    color: var(--vueGreen);
    font-weight: 900;
}

.sidebar-head strong {
    color: var(--color-heading);
}

.close-btn {
    display: none;
}

.tutorial-sidebar > button:not(.close-btn) {
    display: grid;
    gap: 0.25rem;
    padding: 0.85rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.18s,
        background-color 0.18s;
}

.tutorial-sidebar > button:hover,
.tutorial-sidebar > button:focus-visible,
.tutorial-sidebar > button.active {
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.1);
    outline: none;
}

button strong {
    color: var(--color-heading);
}

button span {
    font-size: 0.85rem;
    line-height: 1.35;
    opacity: 0.75;
}

@media (max-width: 850px) {
    .tutorial-sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 40;
        width: min(86vw, 340px);
        max-width: none;
        padding: 1rem;
        background: var(--color-background);
        border-right: 1px solid var(--color-border);
        transform: translateX(-105%);
        transition: transform 0.2s ease;
    }

    .tutorial-sidebar.open {
        transform: translateX(0);
    }

    .close-btn {
        width: 2rem;
        height: 2rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        color: var(--color-text);
        background: var(--color-background);
        cursor: pointer;
    }
}
</style>
