<script setup>
import { ref } from 'vue'
import Cubo from '@/components/Cubo.vue'

defineProps({
    rendererMoves: {
        type: Array,
        default: () => []
    },
    fallbackImage: {
        type: String,
        default: null
    },
    alt: {
        type: String,
        default: 'Caso training'
    },
    renderKey: {
        type: [String, Number],
        default: 0
    }
})

const imageBroken = ref(false)

function resolveImagePath(path) {
    if (!path) {
        return ''
    }

    if (/^(https?:|data:|blob:|\/)/.test(path)) {
        return path
    }

    return `/${path.replace(/^\.?\//, '')}`
}
</script>

<template>
    <section class="preview">
        <Cubo
            v-if="rendererMoves.length > 0"
            :key="renderKey"
            :turns="rendererMoves"
            :autoPlayOnTurnsChange="true"
            :keyboardEnabled="false"
            :showControls="false"
            :animationSpeed="0.18"
        />

        <img
            v-else-if="fallbackImage && !imageBroken"
            :src="resolveImagePath(fallbackImage)"
            :alt="alt"
            @error="imageBroken = true"
        >

        <div v-else class="placeholder">
            Caso non disponibile
        </div>
    </section>
</template>

<style scoped>
.preview {
    width: 100%;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
}

.preview :deep(.scene) {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    transform: scale(0.62);
    transform-origin: center;
}

img {
    max-width: min(420px, 80%);
    max-height: 300px;
    object-fit: contain;
}

.placeholder {
    min-width: 220px;
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--color-border-hover);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-background-soft);
    opacity: 0.8;
}

@media (max-width: 700px) {
    .preview {
        min-height: 250px;
    }

    .preview :deep(.scene) {
        transform: scale(0.48);
    }
}
</style>
