<script setup>
import { computed, ref } from 'vue'
import { splitAlgorithm } from '@/js/tutorial'

const props = defineProps({
    algorithm: {
        type: String,
        default: ''
    },
    tips: {
        type: Array,
        default: () => []
    },
    trainingLink: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['training'])

const copied = ref(false)
const moves = computed(() => splitAlgorithm(props.algorithm))
const hasAlgorithm = computed(() => moves.value.length > 0)

async function copyAlgorithm() {
    if (!hasAlgorithm.value) return

    try {
        await navigator.clipboard.writeText(props.algorithm)
        copied.value = true
        window.setTimeout(() => {
            copied.value = false
        }, 1400)
    } catch (err) {
        copied.value = false
    }
}
</script>

<template>
    <section class="algorithm-display" aria-label="Algoritmo">
        <div class="algorithm-head">
            <strong>Algoritmo</strong>
            <div v-if="algorithm.length > 0 ">
                <button type="button" :disabled="!hasAlgorithm" @click="copyAlgorithm">
                    {{ copied ? 'Copiato' : 'Copia' }}
                </button>
                <button
                    v-if="trainingLink"
                    type="button"
                    class="training-btn"
                    @click="emit('training', trainingLink)"
                >
                    {{ trainingLink.label ?? 'Apri training' }}
                </button>
            </div>
        </div>

        <p v-if="hasAlgorithm" class="notation">{{ algorithm }}</p>
        <p v-else class="empty">Questa sezione è concettuale e non richiede un algoritmo fisso.</p>

        <details v-if="tips.length > 0">
            <summary>Consigli</summary>
            <ul>
                <li v-for="tip in tips" :key="tip">{{ tip }}</li>
            </ul>
        </details>
    </section>
</template>

<style scoped>
.algorithm-display {
    display: grid;
    gap: 0.75rem;
    padding: 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
}

.algorithm-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.algorithm-head > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.45rem;
}

strong {
    color: var(--color-heading);
}

button {
    min-height: 2rem;
    padding: 0 0.65rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background);
    font-weight: 800;
    cursor: pointer;
}

button:hover:not(:disabled),
button:focus-visible:not(:disabled),
.training-btn {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.notation {
    margin: 0;
    color: var(--color-heading);
    font-family: monospace;
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.45;
    overflow-wrap: anywhere;
}

.empty {
    margin: 0;
    opacity: 0.72;
}

details {
    color: var(--color-text);
}

summary {
    cursor: pointer;
    font-weight: 800;
}

ul {
    margin: 0.55rem 0 0;
    padding-left: 1.1rem;
}

li + li {
    margin-top: 0.25rem;
}
</style>
