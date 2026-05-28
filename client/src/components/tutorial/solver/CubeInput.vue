<script setup>
import { computed, ref, watch } from 'vue'
import { SOLVED_STATE } from '@/js/cube'

const props = defineProps({
    cubeState: {
        type: String,
        default: ''
    },
    scramble: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:cubeState', 'update:scramble', 'solve'])

const FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B']
const FACE_LABELS = {
    U: 'Up',
    R: 'Right',
    F: 'Front',
    D: 'Down',
    L: 'Left',
    B: 'Back'
}
const FACE_COLORS = {
    U: '#f8fafc',
    R: '#ef4444',
    F: '#22c55e',
    D: '#facc15',
    L: '#f97316',
    B: '#3b82f6'
}
const FACE_NET = [
    { face: 'U', className: 'face-u' },
    { face: 'L', className: 'face-l' },
    { face: 'F', className: 'face-f' },
    { face: 'R', className: 'face-r' },
    { face: 'B', className: 'face-b' },
    { face: 'D', className: 'face-d' }
]

const pickerOpen = ref(false)
const selectedColor = ref('U')
const stickers = ref(stateToStickers(props.cubeState || SOLVED_STATE))
const editorMessage = ref('')

const stateCounts = computed(() => {
    return FACE_ORDER.reduce((counts, face) => {
        counts[face] = stickers.value.filter(sticker => sticker === face).length
        return counts
    }, {})
})

watch(
    () => props.cubeState,
    (value) => {
        if (pickerOpen.value) return
        stickers.value = stateToStickers(value || SOLVED_STATE)
    }
)

function stateToStickers(state) {
    const cleanState = String(state ?? '').replace(/\s+/g, '').toUpperCase()

    if (cleanState.length !== 54 || /[^URFDLB]/.test(cleanState)) {
        return SOLVED_STATE.split('')
    }

    return cleanState.split('')
}

function stickerIndex(face, index) {
    return FACE_ORDER.indexOf(face) * 9 + index
}

function stickerValue(face, index) {
    return stickers.value[stickerIndex(face, index)]
}

function paintSticker(face, index) {
    if (index === 4) return

    const nextStickers = [...stickers.value]
    nextStickers[stickerIndex(face, index)] = selectedColor.value
    stickers.value = nextStickers
    editorMessage.value = ''
}

function openPicker() {
    if(pickerOpen.value)
        pickerOpen.value = false
    else
    {
        stickers.value = stateToStickers(props.cubeState || SOLVED_STATE)
        pickerOpen.value = true
        editorMessage.value = ''
    }
}

function closePicker() {
    pickerOpen.value = false
    editorMessage.value = ''
}

function resetPicker() {
    stickers.value = SOLVED_STATE.split('')
    editorMessage.value = ''
}

function validateStickerCounts() {
    return FACE_ORDER.every(face => stateCounts.value[face] === 9)
}

function confirmPicker() {
    if (!validateStickerCounts()) {
        editorMessage.value = 'Ogni colore deve comparire esattamente 9 volte.'
        return
    }

    const nextState = stickers.value.join('')
    emit('update:cubeState', nextState)
    pickerOpen.value = false
    emit('solve', { source: 'cubeState', cubeState: nextState })
}

function solveFromCurrentState() {
    emit('solve', {
        source: props.scramble.trim() ? 'scramble' : 'cubeState',
        cubeState: props.cubeState,
        scramble: props.scramble
    })
}
</script>

<template>
    <section class="cube-input" aria-label="Input stato cubo">
        <section v-if="!pickerOpen" class="picker-panel">
            <div class="input-row">
                <label for="cube-state">Cube state</label>
                <textarea
                    id="cube-state"
                    :value="cubeState"
                    rows="2"
                    placeholder="UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
                    @input="emit('update:cubeState', $event.target.value)"
                />
            </div>
    
            <div class="input-row">
                <label for="solver-scramble">Import scramble</label>
                <input
                    id="solver-scramble"
                    type="text"
                    :value="scramble"
                    placeholder="R U R' F2 D L2"
                    @input="emit('update:scramble', $event.target.value)"
                >
            </div>
        </section>
        <section v-if="pickerOpen" class="picker-panel" aria-label="Color picker facce">
            <div class="picker-head">
                <div>
                    <strong>Disegna cube state</strong>
                    <span>Seleziona un colore e clicca sugli sticker. I centri restano fissi.</span>
                </div>
                <button type="button" class="icon-btn" aria-label="Chiudi color picker" @click="closePicker">x</button>
            </div>

            <div class="cube-net" aria-label="Cubo 2D">
                <section
                    v-for="item in FACE_NET"
                    :key="item.face"
                    :class="['face-grid', item.className]"
                    :aria-label="FACE_LABELS[item.face]"
                >
                    <button
                        v-for="index in 9"
                        :key="`${item.face}-${index}`"
                        type="button"
                        :class="{ center: index - 1 === 4 }"
                        :style="{ backgroundColor: FACE_COLORS[stickerValue(item.face, index - 1)] }"
                        :aria-label="`${FACE_LABELS[item.face]} sticker ${index}`"
                        :disabled="index - 1 === 4"
                        @click="paintSticker(item.face, index - 1)"
                    />
                </section>
            </div>

            <div class="palette" aria-label="Colori selezionabili">
                <button
                    v-for="face in FACE_ORDER"
                    :key="face"
                    type="button"
                    :class="{ selected: selectedColor === face }"
                    :style="{ '--swatch': FACE_COLORS[face] }"
                    @click="selectedColor = face"
                >
                    <span></span>
                    {{ face }} {{ stateCounts[face] }}/9
                </button>
            </div>

            <p v-if="editorMessage" class="picker-warning" role="alert">{{ editorMessage }}</p>

            <div class="picker-actions">
                <button type="button" @click="resetPicker">Reset</button>
                <button type="button" class="confirm-btn" @click="confirmPicker">Conferma e risolvi</button>
            </div>
        </section>

        <div class="future-tools" aria-label="Strumenti solver">
            <button type="button" @click="openPicker">{{ pickerOpen ? "Scramble o cube state    " : "Color picker facce"}} </button>
            <button type="button" @click="solveFromCurrentState">Risolvi</button>
        </div>

    </section>
</template>

<style scoped>
.cube-input {
    display: grid;
    gap: 0.85rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background-soft);
}

.input-row {
    display: grid;
    gap: 0.35rem;
}

label,
.picker-head strong {
    color: var(--color-heading);
    font-weight: 800;
}

textarea,
input {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 0.65rem;
    color: var(--color-text);
    background: var(--color-background);
    font-family: monospace;
}

textarea:focus,
input:focus {
    border-color: var(--vueGreen);
    outline: none;
}

.future-tools,
.picker-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

button {
    min-height: 2.1rem;
    padding: 0 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    background: var(--color-background);
    font-weight: 800;
    cursor: pointer;
}

button:hover:not(:disabled),
button:focus-visible:not(:disabled) {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
    outline: none;
}

button:disabled {
    cursor: not-allowed;
}

.picker-panel {
    display: grid;
    gap: 0.85rem;
    padding: 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background);
}

.picker-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
}

.picker-head div {
    display: grid;
    gap: 0.2rem;
}

.picker-head span {
    font-size: 0.88rem;
    opacity: 0.75;
}

.icon-btn {
    width: 2rem;
    height: 2rem;
    padding: 0;
}

.cube-net {
    display: grid;
    grid-template-columns: repeat(4, minmax(54px, 1fr));
    grid-template-areas:
        ". up . ."
        "left front right back"
        ". down . .";
    gap: 0.45rem;
    align-items: center;
}

.face-u { grid-area: up; }
.face-r { grid-area: right; }
.face-f { grid-area: front; }
.face-d { grid-area: down; }
.face-l { grid-area: left; }
.face-b { grid-area: back; }

.face-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.18rem;
    aspect-ratio: 1;
    padding: 0.2rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background-soft);
}

.face-grid button {
    min-height: 0;
    aspect-ratio: 1;
    padding: 0;
    border-radius: 4px;
    border-color: rgba(0, 0, 0, 0.35);
}

.face-grid button.center {
    outline: 2px solid var(--vueGreen);
    outline-offset: -3px;
}

.palette {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.45rem;
}

.palette button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
}

.palette button.selected {
    border-color: var(--vueGreen);
    color: var(--vueGreen);
}

.palette span {
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    background: var(--swatch);
}

.picker-warning {
    margin: 0;
    color: #f59e0b;
    font-weight: 800;
}

.confirm-btn {
    color: var(--vueGreen);
    border-color: var(--vueGreen);
}

@media (max-width: 620px) {
    .cube-net {
        grid-template-columns: repeat(4, minmax(42px, 1fr));
        gap: 0.28rem;
    }

    .palette {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
