<script setup>
import { computed, ref } from 'vue'
import SelectVisual from '@/components/utilities/SelectVisual.vue'

const props = defineProps({
    tipiAlgoritmo: {
        type: Array,
        default: () => []
    },
    selectedTypeId: {
        type: [Number, String],
        default: ''
    },
    algorithms: {
        type: Array,
        default: () => []
    },
    selectedIds: {
        type: Array,
        default: () => []
    },
    statsByAlg: {
        type: Object,
        default: () => ({})
    },
    currentAlgorithmId: {
        type: Number,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },
    loadingTypes: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['selectType', 'toggleAlgorithm', 'selectAll', 'clearSelection'])

const brokenImages = ref({})

const typeValues = computed(() => props.tipiAlgoritmo.map(tipo => tipo.idTipoAlg))
const typeTexts = computed(() => props.tipiAlgoritmo.map(tipo => tipo.descTipo))

function getStats(idAlg) {
    return props.statsByAlg[idAlg] ?? {
        best: null,
        media: null,
        nSolves: 0
    }
}

function isSelected(idAlg) {
    return props.selectedIds.includes(idAlg)
}

function formatMs(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return '-'
    }

    return (Number(value) / 1000).toFixed(3)
}

function resolveImagePath(path) {
    if (!path) {
        return ''
    }

    path =  `/${path.replace(/^\.?\//, '')}`
    return path
}

function hasImage(algoritmo) {
    return Boolean(algoritmo.imgpath) && !brokenImages.value[algoritmo.idAlg]
}

function onImageError(idAlg) {
    brokenImages.value = {
        ...brokenImages.value,
        [idAlg]: true
    }
}
</script>

<template>
    <aside class="training-sidebar">
        <SelectVisual
            labelText="Seleziona tipo algoritmo"
            :optionValues="typeValues"
            :optionTexts="typeTexts"
            :modelValue="selectedTypeId || ''"
            :disabled="loadingTypes"
            @update:modelValue="emit('selectType', $event)"
        />

        <div class="selection-actions">
            <button type="button" :disabled="loading || algorithms.length === 0" @click="emit('selectAll')">
                Tutti
            </button>
            <button type="button" :disabled="loading || selectedIds.length === 0" @click="emit('clearSelection')">
                Nessuno
            </button>
        </div>

        <div class="table-shell">
            <table>
                <thead>
                    <tr>
                        <th>Img</th>
                        <th>Best</th>
                        <th>Media</th>
                        <th>nSolve</th>
                        <th>Sel.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="5" class="empty-cell">Caricamento algoritmi...</td>
                    </tr>
                    <tr v-else-if="algorithms.length === 0">
                        <td colspan="5" class="empty-cell">Nessun algoritmo disponibile</td>
                    </tr>
                    <tr
                        v-for="algoritmo in algorithms"
                        v-else
                        :key="algoritmo.idAlg"
                        :class="{
                            selected: isSelected(algoritmo.idAlg),
                            current: algoritmo.idAlg === currentAlgorithmId
                        }"
                        @click="emit('toggleAlgorithm', algoritmo.idAlg)"
                    >
                        <td>
                            <img
                                
                                :src="resolveImagePath(algoritmo.imgpath)"
                                :alt="algoritmo.descAlg"
                                @error="onImageError(algoritmo.idAlg)"
                            >
                           <!-- <span v-else class="image-placeholder">ALG</span>-->
                        </td>
                        <td>{{ formatMs(getStats(algoritmo.idAlg).best) }}</td>
                        <td>{{ formatMs(getStats(algoritmo.idAlg).media) }}</td>
                        <td>{{ getStats(algoritmo.idAlg).nSolves ?? 0 }}</td>
                        <td>
                            <input
                                type="checkbox"
                                :checked="isSelected(algoritmo.idAlg)"
                                @click.stop="emit('toggleAlgorithm', algoritmo.idAlg)"
                                >
                                <div class="bubble-cell">
                                    <div class="bubble">
                                        {{ algoritmo.mosse || 'Nessuna mossa' }}
                                    </div>
                                </div>
                        </td>

                        
                    </tr>
                </tbody>
            </table>
        </div>
    </aside>
</template>

<style scoped>
.training-sidebar {
    height: 80vh;
    min-width: 300px;
    max-width: 390px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow: hidden;
}

.selection-actions {
    display: flex;
    gap: 0.5rem;
}

button {
    flex: 1 1 0;
    height: 2rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background-soft);
    font-weight: 700;
    transition:
        border-color 0.2s,
        color 0.2s,
        background-color 0.2s;
}

button:hover:not(:disabled),
button:focus-visible:not(:disabled) {
    color: var(--vueGreen);
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.12);
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.table-shell {
    min-height: 0;
    flex: 1 1 auto;
    overflow-y: auto;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
    scrollbar-width: auto;
    scrollbar-color: var(--vueGreen) var(--color-background-soft);
    direction: rtl;
    > * {
        direction: ltr;
    }
}

.table-shell::-webkit-scrollbar {
    width: 8px;
}

.table-shell::-webkit-scrollbar-track {
    background: var(--color-background-soft);
}

.table-shell::-webkit-scrollbar-thumb {
    background: var(--vueGreen);
    border-radius: 2px;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

th, td {
    padding: 0.55rem 0.4rem;
    border-bottom: 1px solid var(--color-border);
    text-align: center;
    vertical-align: middle;
    font-size: 0.9rem;
}

.bubble-cell {
    position: relative;
    width: 0;
    padding: 0;

}

.bubble {
    display: none;
    position: absolute;
    left: -280px;
    top: -50px;
    transform: translateY(-50%) translateX(10px);
    min-width: 120px;
    max-width: 300px;
    background: var(--color-background-soft);
    color: var(--color-text);
    border: 2px solid var(--vueGreen);
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    padding: 0.7em 1em;
    font-size: 0.95em;
    z-index: 1000;
    white-space: pre-line;
    pointer-events: none;
    text-wrap-mode: nowrap;
}

tr:hover
{
    .bubble {
        display: block;
        animation: fadeIn 0.18s;
    } 
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-50%) translateX(0); }
    to { opacity: 1; transform: translateY(-50%) translateX(10px); }
}

th {
    position: sticky;
    top: 0;
    z-index: 1;
    color: var(--color-heading);
    background: var(--color-background-mute);
    font-weight: 800;
}

tbody tr {
    cursor: pointer;
    transition:
        background-color 0.18s,
        outline-color 0.18s;
}

tbody tr:hover {
    background: hsla(160, 100%, 37%, 0.08);
}

tbody tr.selected {
    background: hsla(160, 100%, 37%, 0.13);
}

tbody tr.current {
    outline: 2px solid var(--vueGreen);
    outline-offset: -2px;
}

img,
.image-placeholder {
    width: clamp(2.2rem, 6vw, 2.65rem);
    height: clamp(2.2rem, 6vw, 2.65rem);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    object-fit: contain;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--vueGreen);
}

input {
    width: 1rem;
    height: 1rem;
    accent-color: var(--vueGreen);
}

.empty-cell {
    height: 7rem;
    color: var(--color-text);
    opacity: 0.75;
}

@media (max-width: 900px) {
    .training-sidebar {
        width: 100%;
        max-width: none;
        min-width: 0;
        height: 100%;
    }

    th, td {
        padding: 0.45rem 0.3rem;
        font-size: 0.82rem;
    }

    .bubble {
        position: fixed;
        left: 1rem;
        right: 1rem;
        top: auto;
        bottom: 1rem;
        transform: none;
        min-width: 0;
        max-width: none;
        white-space: normal;
        text-wrap-mode: wrap;
    }

    tr:hover .bubble {
        transform: none;
    }
}
</style>
