<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { showAlert } from './alert'
import { closeSolveInfoModal, solveInfoModalState } from './solveInfoModal'

const contentRef = ref(null)
const averageKeys = ['avg3', 'avg5', 'avg12']

const normalizedSolve = computed(() => {
  const solve = solveInfoModalState.solve ?? {}
  const order = solve.order ?? solve.nRecord ?? solve.numero ?? '-'
  const time = solve.time ?? solve.tempo ?? solve.timeMs ?? null
  const executedAt = solve.sessionTime ?? solve.data ?? solve.date ?? null
  const cubeType = solve.cubeType ?? solve.tipoCubo ?? solve.tipo ?? {}
  const isDnf = isSolveDnf(solve)
  const penalties = solve.penalties ?? {
    inspection: Boolean(solve.falloIspezione),
    move: Boolean(solve.falloMossa),
    dnf: isDnf
  }
  const averages = solve.averages ?? solve.medie ?? solve.contributesTo ?? {}

  return {
    order,
    scramble: solve.scramble ?? '-',
    time,
    isDnf,
    formattedTime: formatSolveTime(time, isDnf),
    executedAt,
    formattedDate: formatDate(executedAt),
    penalties: {
      inspection: Boolean(penalties.inspection ?? penalties.falloIspezione),
      move: Boolean(penalties.move ?? penalties.falloMossa),
      dnf: Boolean(penalties.dnf ?? penalties.DNF ?? isDnf)
    },
    cubeType: {
      id: cubeType.id ?? cubeType.idtipo ?? null,
      name: cubeType.name ?? cubeType.desctipo ?? cubeType.description ?? cubeType ?? '-'
    },
    averages: normalizeAverages(averages),
    user: solve.user ?? solve.utente ?? {
      id: null,
      username: 'utente_demo',
      mail: 'demo@example.com'
    }
  }
})

const infoRows = computed(() => [
  { label: 'Ordine', value: `${normalizedSolve.value.order}` },
  { label: 'Tempo', value: normalizedSolve.value.formattedTime },
  { label: 'Data esecuzione', value: normalizedSolve.value.formattedDate },
  { label: 'Tipo cubo', value: normalizedSolve.value.cubeType.name },
  { label: 'Falli', value: formatPenalties(normalizedSolve.value.penalties) }
])

const jsonPayload = computed(() => ({
  solve: {
    order: normalizedSolve.value.order,
    scramble: normalizedSolve.value.scramble,
    time: normalizedSolve.value.time,
    isDnf: normalizedSolve.value.isDnf,
    formattedTime: normalizedSolve.value.formattedTime,
    executedAt: normalizedSolve.value.executedAt,
    formattedDate: normalizedSolve.value.formattedDate,
    penalties: normalizedSolve.value.penalties,
    cubeType: normalizedSolve.value.cubeType,
    averages: normalizedSolve.value.averages
  },
  user: normalizedSolve.value.user
}))

function normalizeAverages(averages) {
  return averageKeys.reduce((acc, key) => {
    const value = averages?.[key]

    if (typeof value === 'boolean') {
      acc[key] = {
        contributes: value,
        value: null,
        position: null
      }
      return acc
    }

    acc[key] = {
      contributes: Boolean(value?.contributes ?? value?.contribuisce ?? value),
      value: value?.value ?? value?.tempo ?? null,
      position: value?.position ?? value?.posizione ?? null,
      solves: value?.solves ?? []
    }

    return acc
  }, {})
}

function isSolveDnf(solve) {
  return Boolean(
    solve?.isdnf ||
    solve?.isDnf ||
    solve?.isDNF ||
    solve?.penalties?.dnf ||
    solve?.penalties?.DNF
  )
}

function formatTime(time) {
  if (time == null || time === '') {
    return '-'
  }

  const numericTime = Number(time)

  if (!Number.isFinite(numericTime)) {
    return String(time)
  }

  const seconds = numericTime / 1000
  return `${seconds.toFixed(3)} s`
}

function formatSolveTime(time, isDnf = false) {
  if (!isDnf) {
    return formatTime(time)
  }

  const formattedTime = formatTime(time)
  return formattedTime === '-' ? 'DNF' : `DNF(${formattedTime})`
}

function formatAverageValue(value) {
  return value == null ? 'DNF' : formatTime(value)
}

function formatDate(date) {
  if (!date) {
    return '-'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date)
  }

  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsedDate)
}

function formatPenalties(penalties) {
  const activePenalties = []

  if (penalties.inspection) activePenalties.push('ispezione')
  if (penalties.move) activePenalties.push('mossa')
  if (penalties.dnf) activePenalties.push('DNF')

  return activePenalties.length > 0 ? activePenalties.join(', ') : 'Nessun fallo'
}

function formatAverage(key, average) {
  if (!average.contributes) {
    return 'Non contribuisce'
  }

  const details = []

  details.push(formatAverageValue(average.value))

  if (average.position) {
    details.push(`posizione ${average.position}`)
  }

  return details.length > 0 ? details.join(' - ') : 'Contribuisce'
}

function getAverageText(key, average) {
  const rows = [
    key.toUpperCase(),
    `Contribuisce: ${average.contributes ? 'si' : 'no'}`
  ]

  rows.push(`Valore: ${formatAverageValue(average.value)}`)

  if (average.position) {
    rows.push(`Posizione: ${average.position}`)
  }

  if (average.solves?.length > 0) {
    rows.push('Solve considerate:')
    average.solves.forEach((solve, index) => {
      rows.push(`  Solve ${index + 1}:`)
      
      Object.entries(solve).forEach(([field, value]) => {
        if(field == "tempo") {
          value = formatSolveTime(value, isSolveDnf(solve))
        }
        rows.push(`    ${field}: ${formatCopiedValue(value)}`)
      })
    })
  }

  return rows.join('\n')
}

function formatCopiedValue(value) {
  if (value == null) {
    return '-'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

async function copyContentText() {
  const text = contentRef.value?.innerText?.trim() ?? ''
  await copyText(text)
  showAlert('Info solve copiate come testo', 'success')
}

async function copyContentJson() {
  await copyText(JSON.stringify(jsonPayload.value, null, 2))
  showAlert('Info solve copiate come JSON', 'success')
}

async function copyAverageText(key) {
  await copyText(getAverageText(key, normalizedSolve.value.averages[key]))
  showAlert(`${key.toUpperCase()} copiata come testo`, 'success')
}

async function copyScramble() {
  await copyText(normalizedSolve.value.scramble)
  showAlert(`Scramble copiato come testo`, 'success')
}

function onKeydown(event) {
  if (event.key === 'Escape' && solveInfoModalState.visible) {
    closeSolveInfoModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="solveInfoModalState.visible"
        class="solve-modal-overlay"
        role="presentation"
        @click.self="closeSolveInfoModal"
      >
        <article
          class="solve-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="solve-modal-title"
        >
          <header class="modal-header">
            <div>
              <p class="eyebrow">Dettaglio solve</p>
              <h2 id="solve-modal-title">Solve {{ normalizedSolve.order }}</h2>
            </div>
            <button
              type="button"
              class="icon-button"
              aria-label="Chiudi scheda solve"
              @click="closeSolveInfoModal"
            >
              x
            </button>
          </header>

          <section ref="contentRef" class="modal-content">
            <dl class="info-grid">
              <div v-for="row in infoRows" :key="row.label" class="info-row">
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value }}</dd>
              </div>
            </dl>

            <section class="scramble-section" aria-label="Scramble">
              <h3>Scramble</h3>
              <p  @click="copyScramble()">{{ normalizedSolve.scramble }}</p>
            </section>

            <section class="averages-section" aria-label="Medie">
              <h3>Migliori medie a cui contribuisce</h3>
              <ul>
                <li
                  v-for="key in averageKeys"
                  :key="key"
                  role="button"
                  tabindex="0"
                  :aria-label="`Copia dati ${key.toUpperCase()}`"
                  @click="copyAverageText(key)"
                  @keydown.enter.prevent="copyAverageText(key)"
                  @keydown.space.prevent="copyAverageText(key)"
                >
                  <span>{{ key.toUpperCase() }}</span>
                  <strong>{{ formatAverage(key, normalizedSolve.averages[key]) }}</strong>
                </li>
              </ul>
            </section>
          </section>

          <footer class="modal-actions">
            <button type="button" class="secondary-button" @click="copyContentText">
              Copia testo
            </button>
            <button type="button" class="primary-button" @click="copyContentJson">
              Copia JSON
            </button>
          </footer>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.solve-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1090;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.42);
}

.solve-modal {
  width: min(620px, 100%);
  max-height: min(86vh, 760px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  background: var(--color-background);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.22);
}

.modal-header,
.modal-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
}

.modal-header {
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.eyebrow {
  margin: 0 0 0.1rem;
  color: var(--vueGreen);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

h2, h3, p {
  margin: 0;
}

h2 {
  color: var(--color-heading);
  font-size: 1.45rem;
  font-weight: 700;
}

h3 {
  margin-bottom: 0.55rem;
  color: var(--color-heading);
  font-size: 0.98rem;
  font-weight: 700;
}

.icon-button,
.primary-button,
.secondary-button {
  min-height: 2.35rem;
  border-radius: 6px;
  font-family: inherit;
  font-weight: 700;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.icon-button {
  width: 2.35rem;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-background);
  line-height: 1;
}

.icon-button:hover,
.icon-button:focus-visible,
.secondary-button:hover,
.secondary-button:focus-visible {
  color: var(--vueGreen);
  border-color: var(--vueGreen);
  background: hsla(160, 100%, 37%, 0.1);
}

.modal-content {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-width: auto;
  scrollbar-color: var(--vueGreen) var(--color-background-soft);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.info-row {
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
}

dt {
  color: var(--vueGreen);
  font-size: 0.78rem;
  font-weight: 700;
}

dd {
  margin: 0.25rem 0 0;
  color: var(--color-text);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.scramble-section,
.averages-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.scramble-section p {
  padding: 0.85rem;
  border-radius: 6px;
  color: var(--color-heading);
  background: var(--color-background-mute);
  font-family: Consolas, 'Courier New', monospace;
  overflow-wrap: anywhere;
}


ul {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

li:hover,
li:focus-visible, .scramble-section>p:hover {
  outline: none;
  background: hsla(160, 100%, 37%, 0.1);
  cursor: copy;
}

li span {
  color: var(--vueGreen);
  font-weight: 800;
}

li strong {
  color: var(--color-text);
  font-weight: 600;
  text-align: right;
}

.modal-actions {
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
}

.primary-button,
.secondary-button {
  padding: 0.65rem 1rem;
}

.primary-button {
  border: 1px solid var(--vueGreen);
  color: #fff;
  background: var(--vueGreen);
}

.primary-button:hover,
.primary-button:focus-visible {
  background: rgba(0, 189, 126, 0.82);
}

.secondary-button {
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-background);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .solve-modal-overlay {
    align-items: stretch;
  }

  .solve-modal {
    max-height: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }
}
</style>
