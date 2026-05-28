<script setup>
import TutorialCard from './TutorialCard.vue'

defineProps({
    categories: {
        type: Array,
        required: true
    },
    showLabel: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['select'])
</script>

<template>
    <section class="tutorial-home" aria-labelledby="tutorial-title">
        <div class="home-copy" v-if="showLabel">
            <span>Tutorial</span>
            <h2 id="tutorial-title">Scegli cosa imparare</h2>
            <p>
                Percorsi guidati, algoritmi copiabili, preview del cubo e collegamenti diretti al training.
            </p>
        </div>

        <div class="category-grid">
            <TutorialCard
                v-for="category in categories"
                :key="category.id"
                :category="category"
                @select="emit('select', $event)"
            />
        </div>
    </section>
</template>

<style scoped>
.tutorial-home {
    height: 100%;
    min-height: 0;
    display: grid;
    align-content: start;
    gap: 1.25rem;
    overflow-y: auto;
    padding: 0.5rem 0 1rem;
}

.home-copy {
    display: grid;
    gap: 0.35rem;
}

.home-copy span {
    color: var(--vueGreen);
    font-size: 0.8rem;
    font-weight: 900;
    text-transform: uppercase;
}

h2 {
    margin: 0;
    color: var(--color-heading);
    font-size: clamp(1.6rem, 2.4vw, 2.3rem);
}

p {
    margin: 0;
    line-height: 1.55;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
}

@media (max-width: 980px) {
    .category-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 620px) {
    .category-grid {
        grid-template-columns: 1fr;
    }
}
</style>
