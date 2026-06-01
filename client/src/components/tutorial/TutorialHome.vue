<script setup>
import TutorialCard from './TutorialCard.vue'
import NotazioneCard from './NotazioneCard.vue';
import { notazioni } from '@/data/tutorial/notazione.js';

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
        
        <h2 id="tutorial-title"  v-if="showLabel">Notazione</h2>
        <div v-for="group in notazioni" v-if="showLabel">
            <p class="subtitle">{{group.title }}</p>
            <p >{{group.description }}</p>
            <div class="notation-grid"  >
                <NotazioneCard
                    v-for="not in group.moves"
                    :notazione="not"
                />
            </div>

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

.subtitle {
    margin: 0;
    color: var(--color-heading);
    font-size: clamp(1rem, 1.5vw, 2rem);
    font-weight: bold;
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

.notation-grid {
    display: grid;
    grid-template-columns: repeat(6 , minmax(0, 1fr));
    gap: 0.5rem;
}

section::-webkit-scrollbar {
    width: 8px;
}

section::-webkit-scrollbar-track {
    background: var(--color-background-soft);
}

section::-webkit-scrollbar-thumb {
    background: var(--vueGreen);
    border-radius: 2px;
}

@media (prefers-color-scheme: dark) {
    section {
        scrollbar-color: var(--vueGreen) var(--color-background-mute);
    }

    section::-webkit-scrollbar-track {
        background: var(--color-background-mute);
    }
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
