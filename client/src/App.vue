<script setup>
import {ref, watch, onMounted, onBeforeUnmount, computed} from 'vue'

import { getWpas, getBpas, getTipiCubo, getUserSolves, getStatistiche} from './js/controller'
import {parseScramble, displayScramble} from './js/cube'
import { useTimerStore } from '@/stores/timer'
import { inputState, showInput } from './components/utilities/modal/showInputModal'

import LogoMenu from './components/header/LogoMenu.vue'
import scramble from './components/header/Scramble.vue'
import btnScramble from './components/header/btnScramble.vue';

import SelectVisual from './components/utilities/SelectVisual.vue'
import BootstrapAlert from './components/utilities/modal/BootstrapAlert.vue'
import SolveInfoModal from './components/utilities/modal/SolveInfoModal.vue'
import InputModal from './components/utilities/modal/inputModal.vue'
import { solveInfoModalState } from './components/utilities/modal/solveInfoModal'

import asideTable from './components/timer/asideTable.vue'
import timer from './components/timer/timer.vue';
import trainingPage from './components/training/training.vue'
import trainingHeader from './components/header/trainingHeader.vue'
import { useTrainingStore } from '@/stores/training'
import tutorialPage from './components/tutorial/tutorial.vue'

import login from './components/login/login.vue'
import Cubo from './components/Cubo.vue'
import { showAlert } from './components/utilities/modal/alert'

import TutorialHome from './components/tutorial/TutorialHome.vue'
import { tutorialCategories } from '@/data/tutorial/categories'


// --- Training header logic ---
const training = useTrainingStore()

const selectedCount = computed(() => training.selectedAlgorithmIds.length)
const totalAlgorithms = computed(() => training.algorithms.length)
const guideMessage = computed(() => {
  if (training.loadingAlgorithms || training.loadingTypes) {
    return 'Caricamento dati training...'
  }
  if (totalAlgorithms.value === 0) {
    return 'Nessun algoritmo disponibile per questo tipo'
  }
  if (selectedCount.value === 0) {
    return 'Seleziona almeno un algoritmo dalla tabella laterale'
  }
  if (!training.isTrainingActive) {
    return 'Avvia il training per generare il primo caso'
  }
  return ''
})

function startTraining() {
  training.startTraining()
}

function stopTraining() {
  training.stopTraining()
}


const tipiCubo = ref([])
const scrambleCmp = ref(null)
const cuboCmp = ref(null)
const page = ref('timer')
var pagePrec = null
const tipoCuboModel = ref(1)
const bpas = ref([])
const wpas = ref([])
const timerStore = useTimerStore()

let currentScrambleMoves = []
const showScramble = ref(true)
const selectedTutorialCategoryId = ref('')
const mobileNavOpen = ref(false)
const timerStatsOpen = ref(false)
const timerCubeCollapsed = ref(false)

// Opzioni mostrate nella select dei tipi cubo.
const tipiCuboTexts = computed(() => tipiCubo.value.map(opt => opt.desctipo))
const tipiCuboValues = computed(() => tipiCubo.value.map(opt => opt.idtipo))

// Oggetto completo del tipo cubo selezionato.
const selectedTipoCubo = computed(() => {
  return tipiCubo.value.find(opt => String(opt.idtipo) === String(tipoCuboModel.value)) ?? tipiCubo.value[0]
})
const canUseTimer = computed(() => {
  return page.value === 'timer' && !inputState.visible && !solveInfoModalState.visible
})
const hasTimerCube = computed(() => page.value === 'timer' && Boolean(selectedTipoCubo.value?.rendered))
const hasOverlayOpen = computed(() => mobileNavOpen.value || timerStatsOpen.value)

function closeResponsivePanels() {
  mobileNavOpen.value = false
  timerStatsOpen.value = false
}

// Ricalcola BPA/WPA quando cambiano le solve locali.
function updatePossibleAvgs() {
  bpas.value = getBpas(false, true, true)
  wpas.value = getWpas(false, true, true)
}

function clearScramble() {
  timerStore.scramble = ''
  timerStore.scrambleSource = null
  currentScrambleMoves = []

  if (scrambleCmp.value) {
    scrambleCmp.value.setScramble([])
  }
}

function onBtnEvent(action) {
  const cmp = scrambleCmp.value

  switch(action) {
    case 'generate':
      if (!selectedTipoCubo.value?.scrambled || !cmp) return
      cmp.generateScramble()
      break

    case 'oldScramble':
      if (!selectedTipoCubo.value?.scrambled || !cmp) return
      if (cmp.prevScramble.at(-1)?.length)
        cmp.oldScramble()
      break

    case 'insert':
      showInput()
      showScramble.value = true
      break
  }
}

function onPageChange(newPage) {
  if(timerStore.phase == 'idle') {
    if(newPage == 'login' && page.value == 'login')
      newPage = pagePrec
    pagePrec = page.value
    page.value = newPage
    closeResponsivePanels()
  } 
}

function openTrainingFromTutorial(trainingLink) {
  training.requestTutorialTraining(trainingLink)
  onPageChange('training')
}

function openTutorialCategory(categoryId) {
  console.log(selectedTutorialCategoryId.value)
  selectedTutorialCategoryId.value = categoryId
  onPageChange('tutorial')
}

function closeLogin(){
  page.value = pagePrec
  closeResponsivePanels()
}

function newScramble(newScramble, source = 'auto') {
  if (typeof newScramble === 'string' && newScramble.trim() === '') {
    clearScramble()
    timerStore.scrambleSource = source === 'manual' ? 'manual' : null
    return
  }

  if(Array.isArray(newScramble))
    newScramble =  newScramble.join(' ')
  
  try
  {
    let verChar = true
    
    newScramble.toLowerCase().split('').forEach(char => {
      verChar &= 'fbrlud\' 123'.includes(char)
    })

    if(!verChar)
      throw new Error("Caratteri non validi");
  
    newScramble = parseScramble(newScramble)

    newScramble = displayScramble(newScramble)
    currentScrambleMoves = [...newScramble]
    
    timerStore.scramble = newScramble
    timerStore.scrambleSource = source
  
    if (cuboCmp.value) {
      cuboCmp.value.applyNewScramble(newScramble)
    }
    if (scrambleCmp.value) {
      scrambleCmp.value.setScramble(newScramble)
    }
  }
  catch(err)
  {
    showAlert('Lo scramble non è nel fomato corretto', 'warning')
    showInput()
  }
}

onMounted(async () => {
  window.addEventListener('solves-updated', updatePossibleAvgs)
  updatePossibleAvgs()

  window.addEventListener('scramble-change', handleManualScramble)
  window.addEventListener('keydown', handleGlobalKeydown)

  tipiCubo.value = await getTipiCubo()

  if (tipiCubo.value.length > 0) {
    tipoCuboModel.value = tipiCubo.value[0].idtipo
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('solves-updated', updatePossibleAvgs)
  window.removeEventListener('scramble-change', handleManualScramble)
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.body.classList.remove('no-scroll')

})

function handleManualScramble(e) {
  newScramble(e.detail, 'manual')
}

function handleGlobalKeydown(e) {
  if (e.key === 'Escape') {
    closeResponsivePanels()
  }
}

function changeTutorialCategory(newCategory){
  selectedTutorialCategoryId.value = newCategory
}

// Watch for timer phase changes - auto-generate scramble when timer stops
watch(() => timerStore.phase, (newPhase, oldPhase) => {
  if (oldPhase === 'running' && newPhase === 'idle' && selectedTipoCubo.value?.scrambled && scrambleCmp.value) {
    // Genera automaticamente uno scramble dopo una solve salvata.
    scrambleCmp.value.generateScramble()
    showScramble.value = selectedTipoCubo.value.scrambled
  }
})

watch(hasOverlayOpen, (isOpen) => {
  document.body.classList.toggle('no-scroll', isOpen)
}, { flush: 'post' })

watch(page, () => {
  timerStatsOpen.value = false
  mobileNavOpen.value = false
})

// Quando il cubo 3D viene montato, applica l'ultimo scramble gia generato.
watch(cuboCmp, (cmp) => {
  if (cmp && currentScrambleMoves.length > 0) {
    cmp.applyNewScramble(currentScrambleMoves)
  }
}, { flush: 'post' })

// Aggiorna sessionStorage e solve quando cambia tipo cubo.
watch(selectedTipoCubo, async (tipoCubo) => {
  if (!tipoCubo) return

  sessionStorage.setItem('tipoCubo', JSON.stringify(tipoCubo))
  showScramble.value = tipoCubo.scrambled
  await Promise.all([getUserSolves(), getStatistiche()])
  
  if (!tipoCubo.scrambled) {
    clearScramble()
    return
  }

  if (timerStore.phase === 'idle' && scrambleCmp.value) {
    scrambleCmp.value.generateScramble()
  }
})


</script>

<template>
  <header class="app-header">
    <div class="brand-block">
      <img alt="T-Cube logo" class="logo" src="./assets/logo.svg" @click="onPageChange('login')"/>
      <LogoMenu class="desktop-nav" :page="page" @pageChange="onPageChange"/>
      <button
        type="button"
        class="mobile-menu-toggle"
        :aria-expanded="mobileNavOpen"
        aria-label="Apri menu navigazione"
        @click="mobileNavOpen = true"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div v-if="mobileNavOpen" class="app-overlay" @click="closeResponsivePanels"></div>
    <nav :class="['mobile-nav-drawer', { open: mobileNavOpen }]" aria-label="Navigazione mobile">
      <div class="drawer-head">
        <strong>T-CUBE</strong>
        <button type="button" aria-label="Chiudi menu navigazione" @click="mobileNavOpen = false">x</button>
      </div>
      <LogoMenu :page="page" @pageChange="onPageChange"/>
    </nav>

    <div v-if="page == 'timer'" class="header-context timer-header-context">
      <div class="timer-header-grid">
        <SelectVisual
          :labelText="'Seleziona la tipologia di cubo'"
          :optionValues="tipiCuboValues"
          :optionTexts="tipiCuboTexts"
          :disabled="timerStore.phase != 'idle'"
          v-model="tipoCuboModel"
          class="cube-type-select"
        ></SelectVisual>
        <scramble v-if="showScramble" ref="scrambleCmp" @newScramble="newScramble"></scramble>
        <InputModal></InputModal>
      </div>
      <btnScramble class="scramble-actions" :hasAutoScramble="Boolean(selectedTipoCubo?.scrambled)" @btnAction="onBtnEvent"></btnScramble>
    </div>
    <div id="trainingHeader" v-else-if="page == 'training'" class="header-context">
      <trainingHeader 
        :training="training"
        :guideMessage="guideMessage"
        :selectedCount="selectedCount"
        :startTraining="startTraining"
        :stopTraining="stopTraining"
      />
    </div>
    <div v-else-if="page == 'tutorial' && selectedTutorialCategoryId != ''" class="header-context tutorial-header-home">
      <TutorialHome
      :showLabel="false"
      :categories="tutorialCategories"
      @select="openTutorialCategory"
      />
      
    </div>
    <div v-else-if="page == 'tutorial'">

    </div>
    <div v-else>

    </div>
    

  </header>
  <main :class="['app-main', `${page}-main`, { 'training-main': page == 'training' || page == 'tutorial' }]">
    <div v-if="page == 'timer' && timerStatsOpen" class="app-overlay timer-overlay" @click="timerStatsOpen = false"></div>
    <aside v-if="page == 'timer'" :class="['timer-stats-drawer', { open: timerStatsOpen }]">
      <div class="drawer-head timer-drawer-head">
        <strong>Statistiche</strong>
        <button id="btnCloseStatistics" type="button" aria-label="Chiudi statistiche" @click="timerStatsOpen = false">x</button>
      </div>
      <asideTable></asideTable>
    </aside>
    <section :class="['page-section', { 'training-section': page == 'training' || page == 'tutorial', 'timer-section': page == 'timer' }]">
      <div v-if="page == 'timer'" class="timer-mobile-toolbar">
        <button class="w-100" type="button" @click="timerStatsOpen = true">Statistiche</button>
        <button v-if="hasTimerCube && false" type="button" @click="timerCubeCollapsed = !timerCubeCollapsed">
          {{ timerCubeCollapsed ? 'Mostra cubo' : 'Nascondi cubo' }}
        </button>
      </div>
      
      
      <timer v-if="page == 'timer'" :wpas="wpas" :bpas="bpas" :canUseTimer="canUseTimer"></timer>
      <tutorialPage
      v-if="page == 'tutorial'"
      :selectedCategoryId="selectedTutorialCategoryId"
      @openTraining="openTrainingFromTutorial"
      @changeSelectedCategory="changeTutorialCategory"
      ></tutorialPage>
      <trainingPage v-if="page == 'training'"></trainingPage>
      <login v-if="page == 'login'" class="" @closeLogin="closeLogin"></login>

    </section>
    
    <!--<div class="col-3"></div>-->
    
  </main>
  <div v-if="hasTimerCube" :class="['timer-cube-shell', { collapsed: timerCubeCollapsed }]">
    <button
      type="button"
      class="timer-cube-toggle"
      :aria-expanded="!timerCubeCollapsed"
      @click="timerCubeCollapsed = !timerCubeCollapsed"
    >
      {{ timerCubeCollapsed ? 'Cubo' : 'x' }}
    </button>
    <Cubo v-if="!timerCubeCollapsed" ref="cuboCmp" class="timer-cube" :autoPlayOnTurnsChange="true" style="transform: scale(0.7)"></Cubo>
  </div>
  <BootstrapAlert></BootstrapAlert>
  <SolveInfoModal></SolveInfoModal>
  
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  line-height: 1.5;
  background: color-mix(in srgb, var(--color-background) 92%, transparent);
  backdrop-filter: blur(10px);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
}

.logo {
  width: clamp(4rem, 9vw, 8.125rem);
  height: clamp(4rem, 9vw, 8.125rem);
  cursor: pointer;
  flex: 0 0 auto;
}

.desktop-nav {
  display: block;
}

.mobile-menu-toggle,
.drawer-head button,
.timer-mobile-toolbar button,
.timer-cube-toggle {
  min-height: 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  background: var(--color-background-soft);
  font-weight: 800;
  cursor: pointer;
}

.mobile-menu-toggle {
  width: 2.5rem;
  display: none;
  place-items: center;
  gap: 0.22rem;
  padding: 0.45rem;
  
}

.mobile-menu-toggle span {
  width: 1.25rem;
  height: 2px;
  display: block;
  background: currentColor;
}

.header-context {
  min-width: 0;
  width: 100%;
}

.timer-header-context {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);
}

.timer-header-grid {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(12rem, 20rem) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-1);
}

.cube-type-select {
  width: 80%;
  min-width: 0;
}

.scramble-actions {
  justify-self: end;
}

.app-main {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
}

.timer-main {
  display: grid;
  grid-template-columns: minmax(18rem, 24rem) minmax(0, 1fr);
  gap: var(--space-5);
  align-items: stretch;
  min-height: calc(100dvh - var(--navbar-height) - 2rem);
}

.training-main {
  width: 100%;
  min-height: calc(100dvh - var(--navbar-height) - 1rem);
}

.page-section {
  min-width: 0;
}

.training-section {
  height: 100%;
  max-width: 100%;
  min-width: 0;
}

.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.timer-mobile-toolbar {
  display: none;
}

.timer-stats-drawer {
  min-width: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.timer-drawer-head {
  display: none;
}

.tutorial-header-home {
  min-width: 0;
}

.tutorial-header-home:deep(.tutorial-home) {
  width: 100%;
  height: auto;
  padding: 0;
  overflow: visible;
}

.tutorial-header-home:deep(.category-grid) {
  grid-template-columns: repeat(3, minmax(8rem, 1fr));
  gap: 0.65rem;
}

.tutorial-header-home:deep(.tutorial-card) {
  min-height: 4.75rem;
  padding: 0.65rem;
}

.app-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(0, 0, 0, 0.44);
}

.mobile-nav-drawer {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: var(--z-drawer);
  width: min(86vw, 22rem);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  transform: translateX(-105%);
  transition: transform var(--transition-fast);

}

.mobile-nav-drawer.open {
  transform: translateX(0);
  height: max-content;
  border-bottom: 1px solid var(--color-border);
  border-bottom-right-radius: 8px;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.drawer-head strong {
  color: var(--color-heading);
  font-weight: 900;
}

.drawer-head button {
  width: 2.25rem;
}

.timer-cube-shell {
  position: fixed;
  right: 3rem;
  bottom: 3rem;
  z-index: 15;
  width: clamp(11rem, 24vw, 20rem);
  aspect-ratio: 1;
  pointer-events: none;
}

.timer-cube-toggle {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  min-width: 2.5rem;
  padding: 0 0.6rem;
  pointer-events: auto;
}

.timer-cube {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.timer-cube:deep(.scene) {
  position: static;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
  margin: 0;
  transform: scale(0.78);
  transform-origin: center;
}

.timer-cube-shell.collapsed {
  width: auto;
  height: auto;
  aspect-ratio: auto;
}

.timer-cube-shell.collapsed .timer-cube, #btnCloseStatistics {
  display: none;
}



@media (max-width: 1024px) {
  .app-header {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .brand-block {
    justify-content: space-between;
  }

  .timer-header-context {
    grid-template-columns: 1fr;
  }

  .timer-header-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .scramble-actions {
    justify-self: stretch;
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: grid;
  }

  .timer-main {
    display: block;
    min-height: auto;
  }

  .timer-section {
    min-height: calc(100dvh - 14rem);
    justify-content: flex-start;
    padding-top: var(--space-3);
  }

  .timer-mobile-toolbar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    justify-content: center;
    margin-bottom: var(--space-2);
  }

  .timer-mobile-toolbar button {
    flex: 1 1 9rem;
    max-width: 13rem;
  }

  .timer-stats-drawer {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: var(--z-drawer);
    width: min(92vw, var(--sidebar-width));
    height: 100dvh;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    background: var(--color-background);
    border-right: 1px solid var(--color-border);
    transform: translateX(-105%);
    transition: transform var(--transition-fast);
  }

  .timer-stats-drawer.open {
    transform: translateX(0);
  }

  .timer-drawer-head {
    display: flex;
  }

  #btnCloseStatistics{
    display: block;
  }

  .timer-cube-shell {
    width: min(42vw, 12rem);
    opacity: 0.95;
  }

  .tutorial-header-home {
    display: none;
  }

  .cube-type-select {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 640px) {
  .app-header {
    position: relative;
    padding-top: 0;
  }

  .logo {
    width: 3.8rem;
    height: 3.8rem;
  }
}

@media (max-width: 900px) and (orientation: landscape) {
  .app-header {
    position: relative;
  }

  .timer-header-grid {
    grid-template-columns: minmax(10rem, 16rem) minmax(0, 1fr);
  }

  .timer-section {
    min-height: auto;
  }

  .timer-cube-shell {
    width: min(22vw, 10rem);
  }
}
</style>

