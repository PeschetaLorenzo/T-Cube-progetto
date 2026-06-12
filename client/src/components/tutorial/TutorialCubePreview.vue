<script setup>
import { computed, ref } from 'vue'
import Cubo from '@/components/Cubo.vue'
import { resolvePublicPath, splitAlgorithm } from '@/js/tutorial'

const props = defineProps({
    imagePath: {
        type: String,
        default: ''
    },
    cubeState: {
        type: String,
        default: null
    },
    algorithm: {
        type: String,
        default: ''
    },
    alt: {
        type: String,
        default: 'Anteprima cubo'
    }
})

const imageBroken = ref(false)
const cubeRef = ref(null)
const imageSrc = computed(() => resolvePublicPath(props.imagePath))
const algorithmMoves = computed(() => splitAlgorithm(props.algorithm))
const canRenderCube = computed(() => Boolean(props.cubeState) /*|| algorithmMoves.value.length > 0*/)
const canPlayAnimation = computed(() => algorithmMoves.value.length > 0)
const hasImage = computed(() => Boolean(imageSrc.value) && !imageBroken.value)
const fallbackMessage = computed(() => {
    if (!props.imagePath && !canRenderCube.value) {
        return 'Anteprima non ancora disponibile.'
    }

    return 'Immagine non disponibile.'
})

function playCubeAnimation() {
    cubeRef.value?.playTurns?.()
}
</script>

<template>
    <section class="cube-preview" aria-label="Anteprima cubo">
        <div v-if="canRenderCube" class="cube-render">
            <Cubo
                ref="cubeRef"
                :key="`${cubeState ?? 'solved'}-${algorithm}`"
                :cubeState="cubeState"
                :turns="algorithmMoves"
                :autoPlayOnTurnsChange="false"
                :animationSpeed="0.55"
            />
            <button
                v-if="canPlayAnimation"
                type="button"
                class="play-animation"
                aria-label="Avvia animazione cubo"
                title="Avvia animazione cubo"
                @click="playCubeAnimation"
            >
                &#9654;
            </button>
        </div>
        
        <img
            v-else-if="hasImage"
            :src="imageSrc"
            :alt="alt"
            loading="lazy"
            @error="imageBroken = true"
        >


        <div v-else class="preview-placeholder" role="status">
            <strong>Cubo</strong>
            <span>{{ fallbackMessage }}</span>
        </div>
    </section>
</template>

<style scoped>
.cube-preview {
    min-height: clamp(12rem, 30vh, 13.75rem);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
}

img {
    width: min(260px, 86%);
    max-height: min(210px, 36vh);
    object-fit: contain;
}

.cube-render {
    position: relative;
    width: min(240px, 100%);
    height: clamp(12rem, 30vh, 13.75rem);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.cube-render :deep(.scene) {
    position: static;
    width: 100px;
    height: 100px;
    margin: 0;
    transform: scale(0.48);
    transform-origin: center;
}

.play-animation {
    position: absolute;
    right: 0.65rem;
    bottom: 0.65rem;
    width: 2.35rem;
    height: 2.35rem;
    display: inline-grid;
    place-items: center;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    color: var(--color-heading);
    background: var(--color-background);
    box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.16);
    font-size: 0.95rem;
    line-height: 1;
    cursor: pointer;
}

.play-animation:hover,
.play-animation:focus-visible {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
    outline: none;
}

.preview-placeholder {
    width: min(260px, 86%);
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 1rem;
    border: 1px dashed var(--color-border-hover);
    border-radius: 8px;
    color: var(--color-text);
    text-align: center;
}

.preview-placeholder strong {
    color: var(--vueGreen);
}

.preview-placeholder span {
    font-size: 0.9rem;
    line-height: 1.35;
    opacity: 0.75;
}

@media (max-width: 640px) {
    .cube-preview {
        min-height: 10rem;
    }

    .cube-render {
        height: 10rem;
    }

    .cube-render :deep(.scene) {
        transform: scale(0.42);
    }
}
</style>
