<script setup>
import TutorialCubePreview from './TutorialCubePreview.vue'
import AlgorithmDisplay from './AlgorithmDisplay.vue'

defineProps({
    step: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['training'])
</script>

<template>
    <article class="tutorial-step">
        <div class="step-copy">
            <span class="step-index">Step {{ index + 1 }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            
            <section v-if="step.contentNotes?.length" class="author-notes" aria-label="Note contenuti">
                <strong>Note</strong>
                <ul>
                    <li v-for="note in step.contentNotes" :key="note">{{ note }}</li>
                </ul>
            </section>
            
        </div>

        <TutorialCubePreview
            :imagePath="step.imagePath"
            :cubeState="step.cubeState"
            :algorithm="step.algorithm"
            :alt="step.title"
        />

        <AlgorithmDisplay
            :algorithm="step.algorithm"
            :tips="step.tips"
            :trainingLink="step.trainingLink"
            @training="emit('training', $event)"
        />
    </article>
</template>

<style scoped>
.tutorial-step {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(250px, 0.9fr);
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background);
}

.step-copy {
    min-width: 0;
    display: grid;
    align-content: start;
    gap: 0.55rem;
}

.step-index {
    color: var(--vueGreen);
    font-size: 0.78rem;
    font-weight: 900;
    text-transform: uppercase;
}

h3 {
    margin: 0;
    color: var(--color-heading);
    font-size: 1.4rem;
}

p {
    margin: 0;
    color: var(--color-text);
    line-height: 1.55;
}

.author-notes {
    display: grid;
    gap: 0.35rem;
    margin-top: 0.35rem;
    padding: 0.75rem;
    border-left: 3px solid var(--vueGreen);
    background: var(--color-background-soft);
}

.author-notes strong {
    color: var(--color-heading);
    font-size: 0.88rem;
}

.author-notes ul {
    margin: 0;
    padding-left: 1rem;
}

.author-notes li {
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.82;
}

.tutorial-step :deep(.algorithm-display) {
    grid-column: 1 / -1;
}

@media (max-width: 780px) {
    .tutorial-step {
        grid-template-columns: 1fr;
    }
}
</style>
