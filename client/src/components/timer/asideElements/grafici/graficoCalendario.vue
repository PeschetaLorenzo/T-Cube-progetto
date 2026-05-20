<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getCalendarMonth } from '@/js/controller'
import { showAlert } from '@/components/utilities/modal/alert'
import { openSolveInfoModal } from '@/components/utilities/modal/solveInfoModal'

const monthNames = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre'
]
const weekdays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

const today = new Date()
const visibleYear = ref(today.getFullYear())
const visibleMonth = ref(today.getMonth() + 1)
const selectedDate = ref(toDateInputValue(today))
const dateInput = ref(selectedDate.value)
const calendar = ref(buildEmptyMonth(visibleYear.value, visibleMonth.value))
const loading = ref(false)

const monthTitle = computed(() => `${monthNames[visibleMonth.value - 1]} ${visibleYear.value}`)
const selectedDay = computed(() => {
    return calendar.value.days.find(day => day.date === selectedDate.value) ?? null
})
const paddedDays = computed(() => {
    const offset = ((calendar.value.startsOn ?? 0) + 6) % 7
    return [
        ...Array.from({ length: offset }, (_, index) => ({ placeholder: true, key: `empty-${index}` })),
        ...calendar.value.days
    ]
})

function toDateInputValue(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function buildEmptyMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate()

    return {
        year,
        month,
        startsOn: new Date(year, month - 1, 1).getDay(),
        days: Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1
            return {
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                solveCount: 0,
                average: null,
                bestTime: null,
                bestAvg5: null,
                bestAvg12: null,
                records: []
            }
        })
    }
}

function normalizeCalendar(payload) {
    const empty = buildEmptyMonth(visibleYear.value, visibleMonth.value)
    const daysByDate = new Map((payload?.days ?? []).map(day => [day.date, day]))

    return {
        ...empty,
        ...(payload ?? {}),
        days: empty.days.map(day => ({
            ...day,
            ...(daysByDate.get(day.date) ?? {}),
            records: daysByDate.get(day.date)?.records ?? []
        }))
    }
}

async function loadMonth() {
    loading.value = true

    try {
        const data = await getCalendarMonth(visibleYear.value, visibleMonth.value)
        calendar.value = normalizeCalendar(data)
    } catch (err) {
        console.error('Errore caricamento calendario:', err)
        calendar.value = buildEmptyMonth(visibleYear.value, visibleMonth.value)
        showAlert('Impossibile caricare il calendario', 'warning')
    } finally {
        loading.value = false
    }
}

function changeMonth(delta) {
    const next = new Date(visibleYear.value, visibleMonth.value - 1 + delta, 1)
    visibleYear.value = next.getFullYear()
    visibleMonth.value = next.getMonth() + 1
    selectedDate.value = toDateInputValue(next)
    dateInput.value = selectedDate.value
}

function goToDate() {
    if (!dateInput.value) {
        return
    }

    const [year, month] = dateInput.value.split('-').map(Number)
    visibleYear.value = year
    visibleMonth.value = month
    selectedDate.value = dateInput.value
}

function selectDay(day) {
    if (!day?.date) {
        return
    }

    selectedDate.value = day.date
    dateInput.value = day.date
}

function getDayNumber(date) {
    return Number(date.slice(-2))
}

function getIntensityClass(solveCount) {
    if (solveCount <= 0) return 'level-0'
    if (solveCount < 5) return 'level-1'
    if (solveCount < 15) return 'level-2'
    if (solveCount < 30) return 'level-3'
    if (solveCount < 60) return 'level-4'
    if (solveCount < 100) return 'level-5'
    return 'level-6'
}

function formatMs(value) {
    const time = Number(value)
    return Number.isFinite(time) ? `${(time / 1000).toFixed(3)}s` : 'DNF'
}

function openRecordSolve(record) {
    if (record?.solveOrder) {
        openSolveInfoModal(record.solveOrder)
    }
}

watch([visibleYear, visibleMonth], loadMonth)

onMounted(() => {
    loadMonth()
    window.addEventListener('solves-updated', loadMonth)
    window.addEventListener('stats-updated', loadMonth)
})

onBeforeUnmount(() => {
    window.removeEventListener('solves-updated', loadMonth)
    window.removeEventListener('stats-updated', loadMonth)
})
</script>

<template>
    <div class="calendar-panel">
        <div class="calendar-controls">
            <button type="button" aria-label="Mese precedente" @click="changeMonth(-1)">&lt;</button>
            <strong>{{ monthTitle }}</strong>
            <button type="button" aria-label="Mese successivo" @click="changeMonth(1)">&gt;</button>
            <!--<input v-model="dateInput" type="date" aria-label="Vai a una data" @change="goToDate">-->
        </div>

        <div class="calendar-grid" :class="{ loading }">
            <span v-for="weekday in weekdays" :key="weekday" class="weekday">{{ weekday }}</span>

            <template v-for="day in paddedDays" :key="day.key ?? day.date">
                <span v-if="day.placeholder" class="day placeholder"></span>
                <button
                    v-else
                    type="button"
                    :class="[
                        'day',
                        getIntensityClass(day.solveCount),
                        {
                            selected: day.date === selectedDate,
                            'has-record': day.records.length > 0
                        }
                    ]"
                    :aria-label="`${day.date}: ${day.solveCount} solve`"
                    @click="selectDay(day)"
                >
                    {{ getDayNumber(day.date) }}
                </button>
            </template>
        </div>

        <section class="day-summary">
            <header>
                <h3>{{ selectedDate }}</h3>
                <span>{{ selectedDay?.solveCount ?? 0 }} solve</span>
            </header>

            <div class="summary-grid">
                <article>
                    <span>Media giorno</span>
                    <strong>{{ formatMs(selectedDay?.average) }}</strong>
                </article>
                <article>
                    <span>Miglior tempo</span>
                    <strong>{{ formatMs(selectedDay?.bestTime) }}</strong>
                </article>
                <article>
                    <span>Migliore ao5</span>
                    <strong>{{ formatMs(selectedDay?.bestAvg5) }}</strong>
                </article>
                <article>
                    <span>Migliore ao12</span>
                    <strong>{{ formatMs(selectedDay?.bestAvg12) }}</strong>
                </article>
            </div>

            <p v-if="selectedDay && selectedDay.solveCount === 0" class="empty-state">
                Nessuna solve in questa data
            </p>

            <div v-if="selectedDay?.records?.length" class="records">
                <button
                    v-for="record in selectedDay.records"
                    :key="record.idRecordEntry"
                    type="button"
                    class="record-card"
                    @click="openRecordSolve(record)"
                >
                    <span class="cup">🏆</span>
                    <span>
                        <strong>{{ record.description }}</strong>
                        <small>{{ formatMs(record.time) }}</small>
                    </span>
                </button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.calendar-panel {
    width: 100%;
    min-width: 18rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.25rem 0.35rem 0.75rem;
}

.calendar-controls {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    gap: 0.35rem;
    align-items: center;
}

.calendar-controls strong {
    min-width: 0;
    color: var(--color-text);
    font-size: 0.95rem;
    font-weight: 700;
    text-align: center;
}

.calendar-controls input {
    grid-column: 1 / -1;
    width: 100%;
    height: 2rem;
    padding: 0 0.45rem;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    color: var(--color-text);
    background: var(--color-background);
}

button {
    border: 1px solid var(--color-border);
    border-radius: 5px;
    color: var(--color-text);
    background: var(--color-background);
    transition:
        color 0.2s,
        border-color 0.2s,
        background-color 0.2s,
        transform 0.2s;
}

button:hover,
button:focus-visible {
    color: var(--vueGreen);
    border-color: var(--vueGreen);
    background: hsla(160, 100%, 37%, 0.12);
}

.calendar-controls button {
    width: 2rem;
    height: 2rem;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(1.65rem, 1fr));
    gap: 0.25rem;
    opacity: 1;
    transition: opacity 0.2s;
}

.calendar-grid.loading {
    opacity: 0.55;
}

.weekday {
    color: var(--color-text);
    font-size: 0.68rem;
    font-weight: 700;
    text-align: center;
}

.day {
    position: relative;
    aspect-ratio: 1;
    min-width: 0;
    padding: 0;
    overflow: hidden;
    color: #f8f8f8;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
}

.day.placeholder {
    border: 0;
    background: transparent;
}

.day.selected {
    box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--vueGreen);
}

.day.has-record::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 40%, #f5c542 90%, #ffe7a3 100%);
    pointer-events: none;
}

.level-0 {
    background: #050505;
}

.level-1 {
    background: #064f35;
}

.level-2 {
    background: #087a4f;
}

.level-3 {
    background: #0aa86a;
}

.level-4 {
    background: #17cc86;
}

.level-5 {
    background: #69e5b1;
    color: #12372a;
}

.level-6 {
    background: #b8f7d9;
    color: #12372a;
}

.day-summary {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    padding: 0.65rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background-soft);
}

.day-summary header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.day-summary h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 0.95rem;
    font-weight: 700;
}

.day-summary header span {
    flex: 0 0 auto;
    color: var(--vueGreen);
    font-size: 0.82rem;
    font-weight: 700;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
}

.summary-grid article {
    min-width: 0;
    padding: 0.45rem;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    background: var(--color-background);
}

.summary-grid span,
.record-card small {
    display: block;
    color: var(--color-text);
    font-size: 0.68rem;
    opacity: 0.75;
}

.summary-grid strong,
.record-card strong {
    display: block;
    min-width: 0;
    overflow-wrap: anywhere;
    color: var(--color-text);
    font-size: 0.86rem;
    font-weight: 700;
}

.empty-state {
    margin: 0;
    color: var(--color-text);
    font-size: 0.82rem;
    text-align: center;
    opacity: 0.72;
}

.records {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.record-card {
    width: 100%;
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 0.45rem;
    align-items: center;
    padding: 0.45rem;
    border-color: rgba(245, 197, 66, 0.8);
    background: linear-gradient(135deg, rgba(245, 197, 66, 0.3), rgba(255, 231, 163, 0.08));
    text-align: left;
}

.record-card:hover,
.record-card:focus-visible {
    color: var(--color-text);
    border-color: #f5c542;
    background: linear-gradient(135deg, rgba(245, 197, 66, 0.42), rgba(255, 231, 163, 0.14));
}

.cup {
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background: rgba(245, 197, 66, 0.28);
    font-size: 1.05rem;
}
</style>
