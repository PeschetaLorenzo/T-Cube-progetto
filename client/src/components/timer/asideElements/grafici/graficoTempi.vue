<script setup>
import Chart from 'chart.js/auto'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { openSolveInfoModal } from '@/components/utilities/modal/solveInfoModal'

const BASE_VISIBLE_SOLVES = 20
const MIN_VISIBLE_SOLVES = 5
const BASE_Y_ZOOM = 1.25

const props = defineProps({
    tempi: {
        type: Array,
        default: () => []
    }
})

const canvasRef = ref(null)
const xStart = ref(0)
const xWindowSize = ref(BASE_VISIBLE_SOLVES)
const yZoom = ref(BASE_Y_ZOOM)

let chart = null
let colorSchemeQuery = null

const solves = computed(() => {
    return [...(props.tempi ?? [])]
        .map((solve, index) => ({
            ...solve,
            originalIndex: index,
            nRecordNumber: Number(solve?.nRecord),
            seconds: Number(solve?.time) / 1000,
            isDnf: isSolveDnf(solve),
            hasPenalty: hasSolvePenalty(solve)
        }))
        .filter(solve => Number.isFinite(solve.seconds))
        .sort((a, b) => {
            if (Number.isFinite(a.nRecordNumber) && Number.isFinite(b.nRecordNumber)) {
                return a.nRecordNumber - b.nRecordNumber
            }

            return a.originalIndex - b.originalIndex
        })
        .map((solve, index) => ({
            ...solve,
            x: index + 1,
            label: Number.isFinite(solve.nRecordNumber) ? solve.nRecordNumber : index + 1
        }))
})

const hasData = computed(() => solves.value.length > 0)
const canPanLeft = computed(() => xStart.value > 0)
const canPanRight = computed(() => xStart.value + xWindowSize.value < solves.value.length)
const canZoomXIn = computed(() => xWindowSize.value > MIN_VISIBLE_SOLVES)
const canZoomXOut = computed(() => xWindowSize.value < solves.value.length)
const canZoomYIn = computed(() => yZoom.value > 0.45)
const canZoomYOut = computed(() => yZoom.value < 4)

function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function getThemeColors() {
    return {
        green: getCssVar('--vueGreen') || 'rgba(0, 189, 126, 1)',
        penalty: '#f5c542',
        dnf: '#dc3545',
        average: getCssVar('--color-text') || '#6c757d',
        text: getCssVar('--color-text') || '#2c3e50',
        border: getCssVar('--color-border') || 'rgba(60, 60, 60, 0.12)',
        fill: 'rgba(0, 189, 126, 0.14)'
    }
}

function isSolveDnf(solve) {
    return Boolean(solve?.isdnf || solve?.isDnf || solve?.penalties?.dnf)
}

function hasSolvePenalty(solve) {
    return Boolean(
        solve?.falloIspezione ||
        solve?.falloMossa ||
        solve?.penalties?.inspection ||
        solve?.penalties?.move
    )
}

function getPointColor(solve, colors = getThemeColors()) {
    if (solve?.isDnf) {
        return colors.dnf
    }

    return solve?.hasPenalty ? colors.penalty : colors.green
}

function updatePointColors(data = chart?.data.datasets[0].data) {
    if (!chart) {
        return
    }

    const colors = getThemeColors()
    const pointColors = (data ?? []).map(point => getPointColor(point, colors))

    chart.data.datasets[0].pointBackgroundColor = pointColors
    chart.data.datasets[0].pointBorderColor = pointColors
}

function formatSeconds(value) {
    return Number.isFinite(value) ? `${value.toFixed(3)}s` : ''
}

function getAverageLineData() {
    const visibleSolves = getVisibleSolves().filter(solve => !solve.isDnf && Number.isFinite(solve.seconds))

    if (visibleSolves.length === 0) {
        return []
    }

    const average = visibleSolves.reduce((sum, solve) => sum + solve.seconds, 0) / visibleSolves.length
    const firstVisible = xStart.value + 1
    const lastVisible = Math.min(xStart.value + xWindowSize.value, solves.value.length)

    return [
        { x: firstVisible, y: average, label: 'Media' },
        { x: lastVisible, y: average, label: 'Media' }
    ]
}

function getVisibleSolves() {
    return solves.value.slice(xStart.value, xStart.value + xWindowSize.value)
}

function clampWindow(keepEnd = false) {
    const total = solves.value.length
    xWindowSize.value = Math.min(Math.max(xWindowSize.value, MIN_VISIBLE_SOLVES), Math.max(total, MIN_VISIBLE_SOLVES))

    const maxStart = Math.max(total - xWindowSize.value, 0)
    xStart.value = keepEnd ? maxStart : Math.min(Math.max(xStart.value, 0), maxStart)
}

function setLatestWindow() {
    xWindowSize.value = Math.min(BASE_VISIBLE_SOLVES, Math.max(solves.value.length, MIN_VISIBLE_SOLVES))
    yZoom.value = BASE_Y_ZOOM
    clampWindow(true)
}

function getYAxisBounds() {
    const visibleValues = getVisibleSolves().map(solve => solve.seconds)

    if (visibleValues.length === 0) {
        return { min: 0, max: 1 }
    }

    const minValue = Math.min(...visibleValues)
    const maxValue = Math.max(...visibleValues)

    if (minValue === maxValue) {
        const padding = Math.max(minValue * 0.2, 1)
        return {
            min: Math.max(0, minValue - padding),
            max: maxValue + padding
        }
    }

    const center = (minValue + maxValue) / 2
    const range = (maxValue - minValue) * yZoom.value

    return {
        min: Math.max(0, center - range / 2),
        max: center + range / 2
    }
}

function updateChartTheme() {
    if (!chart) {
        return
    }

    const colors = getThemeColors()
    chart.data.datasets[0].borderColor = colors.green
    chart.data.datasets[0].backgroundColor = colors.fill
    chart.data.datasets[1].borderColor = colors.average
    updatePointColors()
    chart.options.scales.x.grid.color = colors.border
    chart.options.scales.x.ticks.color = colors.text
    chart.options.scales.y.grid.color = colors.border
    chart.options.scales.y.ticks.color = colors.text
    chart.options.scales.y.title.color = colors.text
}

function updateChart() {
    if (!chart) {
        return
    }

    clampWindow()
    updateChartTheme()

    const data = solves.value.map(solve => ({
        x: solve.x,
        y: solve.seconds,
        label: solve.label,
        isDnf: solve.isDnf,
        hasPenalty: solve.hasPenalty
    }))
    const firstVisible = solves.value.length === 0 ? 0 : xStart.value + 1
    const lastVisible = solves.value.length === 0
        ? BASE_VISIBLE_SOLVES
        : Math.min(xStart.value + xWindowSize.value, solves.value.length)
    const yBounds = getYAxisBounds()

    chart.data.datasets[0].data = data
    chart.data.datasets[1].data = getAverageLineData()
    updatePointColors(data)
    chart.options.scales.x.min = firstVisible - 0.5
    chart.options.scales.x.max = lastVisible + 0.5
    chart.options.scales.y.min = yBounds.min
    chart.options.scales.y.max = yBounds.max
    chart.update()
}

function createChart() {
    const colors = getThemeColors()

    chart = new Chart(canvasRef.value, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Tempi',
                    data: [],
                    borderColor: colors.green,
                    backgroundColor: colors.fill,
                    pointBackgroundColor: colors.green,
                    pointBorderColor: colors.green,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.25
                },
                {
                    label: 'Media',
                    data: [],
                    borderColor: colors.average,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 2,
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            parsing: false,
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            onClick(event) {
                const points = chart.getElementsAtEventForMode(
                    event,
                    'nearest',
                    { intersect: true },
                    true
                )

                const activePoint = points[0]
                const pointIndex = activePoint?.index

                if (pointIndex == null || activePoint.datasetIndex !== 0) {
                    return
                }

                const point = chart.data.datasets[0].data[pointIndex]

                if (point?.label != null) {
                    openSolveInfoModal(point.label)
                }
            },
            onHover(event, points) {
                event.native.target.style.cursor = points.length > 0 ? 'pointer' : 'default'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title(items) {
                            const item = items[0]
                            const point = item?.raw

                            if (item?.dataset.label === 'Media') {
                                return 'Media solve'
                            }

                            return point ? `Solve ${point.label}` : ''
                        },
                        label(item) {
                            if (item.dataset.label === 'Media') {
                                return `Media: ${formatSeconds(item.parsed.y)}`
                            }

                            return `Tempo: ${formatSeconds(item.parsed.y)}`
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 0.5,
                    max: BASE_VISIBLE_SOLVES + 0.5,
                    ticks: {
                        color: colors.text,
                        precision: 0,
                        stepSize: 1,
                        callback(value) {
                            const solve = solves.value[Number(value) - 1]
                            return solve ? `${solve.label}` : ''
                        }
                    },
                    grid: {
                        color: colors.border
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Secondi',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text,
                        callback(value) {
                            return `${Number(value).toFixed(2)}s`
                        }
                    },
                    grid: {
                        color: colors.border
                    }
                }
            }
        }
    })

    updateChart()
}

function panSolves(direction) {
    const step = Math.max(1, Math.floor(xWindowSize.value / 2))
    xStart.value += direction * step
    updateChart()
}

function zoomX(direction) {
    const nextSize = direction > 0
        ? Math.floor(xWindowSize.value * 0.75)
        : Math.ceil(xWindowSize.value * 1.35)

    xWindowSize.value = nextSize
    updateChart()
}

function zoomY(direction) {
    yZoom.value = direction > 0
        ? Math.max(0.4, yZoom.value * 0.8)
        : Math.min(4, yZoom.value * 1.25)

    updateChart()
}

function resetZoom() {
    setLatestWindow()
    updateChart()
}

watch(
    solves,
    (newSolves, oldSolves) => {
        const oldTotal = oldSolves?.length ?? 0
        const wasAtEnd = oldTotal === 0 || xStart.value + xWindowSize.value >= oldTotal

        if (wasAtEnd) {
            setLatestWindow()
        } else {
            clampWindow()
        }

        updateChart()
    },
    { deep: true }
)

onMounted(async () => {
    await nextTick()
    setLatestWindow()
    createChart()

    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    colorSchemeQuery.addEventListener('change', updateChart)
})

onBeforeUnmount(() => {
    colorSchemeQuery?.removeEventListener('change', updateChart)
    chart?.destroy()
})
</script>

<template>
    <div class="chart-panel">
        <div class="chart-controls">
            <div class="control-group" aria-label="Zoom asse X">
                <span class="axis-label">X</span>
                <button type="button" :disabled="!canZoomXOut" aria-label="Riduci zoom asse X" @click="zoomX(-1)">-</button>
                <button type="button" :disabled="!canZoomXIn" aria-label="Aumenta zoom asse X" @click="zoomX(1)">+</button>
            </div>
            
            <div class="control-group" aria-label="Scorrimento solve">
                <button type="button" :disabled="!canPanLeft" aria-label="Mostra solve precedenti" @click="panSolves(-1)">&lt;</button>
                <button id="btnReset" type="button" aria-label="Torna alle ultime 20 solve" @click="resetZoom">↻</button>
                <button type="button" :disabled="!canPanRight" aria-label="Mostra solve successive" @click="panSolves(1)">&gt;</button>
            </div>

            <div class="control-group" aria-label="Zoom asse Y">
                <span class="axis-label">Y</span>
                <button type="button" :disabled="!canZoomYOut" aria-label="Riduci zoom asse Y" @click="zoomY(-1)">-</button>
                <button type="button" :disabled="!canZoomYIn" aria-label="Aumenta zoom asse Y" @click="zoomY(1)">+</button>
            </div>
        </div>
        <div class="chart-area">
            <canvas ref="canvasRef" :class="{ hidden: !hasData }"></canvas>
            <p v-if="!hasData" class="empty-state">Nessuna solve da visualizzare</p>
        </div>
        
    </div>
</template>

<style scoped>
#btnReset{
    transform: scaleY(-1);

}
    
.chart-panel {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction:column-reverse;
    gap: 0.65rem;
    overflow: hidden;
    padding: 0.25rem 0.35rem 0.65rem;
}

.chart-controls {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
    justify-content: space-between;
}

.control-group {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background-soft);
}

.axis-label {
    min-width: 1.1rem;
    color: var(--color-text);
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;
}

button {
    width: 2rem;
    height: 1.8rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    color: var(--color-text);
    background: var(--color-background);
    line-height: 1;
    transition:
        color 0.2s,
        border-color 0.2s,
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

.chart-area {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    min-height: 0;
    overflow: hidden;
}

canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
}

canvas.hidden {
    opacity: 0;
}

.empty-state {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    color: var(--color-text);
    text-align: center;
}
</style>
