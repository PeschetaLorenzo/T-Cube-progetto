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

import login from './components/login/login.vue'
import Cubo from './components/Cubo.vue'
import { showAlert } from './components/utilities/modal/alert'



const tipiCubo = ref([])
const scrambleCmp = ref(null)
const cuboCmp = ref(null)
const page = ref('timer')
const tipoCuboModel = ref(1)
const bpas = ref([])
const wpas = ref([])
const timerStore = useTimerStore()

let scrambleMoves = []
var showScramble = true

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

// Ricalcola BPA/WPA quando cambiano le solve locali.
function updatePossibleAvgs() {
  bpas.value = getBpas(false, true, true)
  wpas.value = getWpas(false, true, true)
}

function clearScramble() {
  timerStore.scramble = ''
  timerStore.scrambleSource = null

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
      if(cmp.prevScramble[cmp.prevScramble.length-1].length != 0)
        cmp.oldScramble()
      break

    case 'insert':
      showInput()
      showScramble = true
      break
  }
}

function onPageChange(newPage) {
  if(timerStore.phase == 'idle') {
    if(newPage == 'login' && page.value == 'login')
      newPage = 'timer'
    page.value = newPage
  } 
}

function closeLogin(){
  page.value = 'timer'
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
    console.log(err)
    showAlert('Lo scramble non è nel fomato corretto', 'warning')
    showInput()
  }
}

onMounted(async () => {
  window.addEventListener('solves-updated', updatePossibleAvgs)
  updatePossibleAvgs()

  window.addEventListener('scramble-change', handleManualScramble)

  tipiCubo.value = await getTipiCubo()

  if (tipiCubo.value.length > 0) {
    tipoCuboModel.value = tipiCubo.value[0].idtipo
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('solves-updated', updatePossibleAvgs)
  window.removeEventListener('scramble-change', handleManualScramble)

})

function handleManualScramble(e) {
  newScramble(e.detail, 'manual')
}

// Watch for timer phase changes - auto-generate scramble when timer stops
watch(() => timerStore.phase, (newPhase, oldPhase) => {
  if (oldPhase === 'running' && newPhase === 'idle' && selectedTipoCubo.value?.scrambled && scrambleCmp.value) {
    // Genera automaticamente uno scramble dopo una solve salvata.
    scrambleCmp.value.generateScramble()
    showScramble = selectedTipoCubo.scrambled
  }
})

// Quando il cubo 3D viene montato, applica l'ultimo scramble gia generato.
watch(cuboCmp, (cmp) => {
  if (cmp && scrambleMoves.length > 0) {
    cmp.applyNewScramble(scrambleMoves)
  }
}, { flush: 'post' })

// Aggiorna sessionStorage e solve quando cambia tipo cubo.
watch(selectedTipoCubo, async (tipoCubo) => {
  if (!tipoCubo) return

  sessionStorage.setItem('tipoCubo', JSON.stringify(tipoCubo))
  showScramble = tipoCubo.scrambled
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
  <header>
    <div>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="130px" height="130px" @click="onPageChange('login')"/>
      <LogoMenu :page="page" @pageChange="onPageChange"/>
    </div>
    <div  v-if="page == 'timer'">
      <div class="row w-100 d-flex justify-content-center">
        <SelectVisual
          :labelText="'Seleziona la tipologia di cubo'"
          :optionValues="tipiCuboValues"
          :optionTexts="tipiCuboTexts"
          :disabled="timerStore.phase != 'idle'"
          v-model="tipoCuboModel"
          class="w-50"
        ></SelectVisual>
        <scramble v-if="showScramble" ref="scrambleCmp" @newScramble="newScramble"></scramble>
        <InputModal></InputModal>
      </div>
      <btnScramble :hasAutoScramble="Boolean(selectedTipoCubo?.scrambled)" @btnAction="onBtnEvent"></btnScramble>
    </div>
    <div id="trainingHeader" v-else-if="page == 'training'">
      <trainingHeader 
        :training="training"
        :guideMessage="guideMessage"
        :selectedCount="selectedCount"
        :startTraining="startTraining"
        :stopTraining="stopTraining"
      />
    </div>
    <div v-else>

    </div>
    

  </header>
  <main :class="['row', { 'training-main': page == 'training' }]">
    <aside v-if="page == 'timer'" class="col-3">
      <asideTable class="ps-3 pe-5"></asideTable>
    </aside>
    <section :class="page == 'training' ? 'col-12 training-section' : 'col-7'">
      <timer v-if="page == 'timer'" class="mr-3" :wpas="wpas" :bpas="bpas" :canUseTimer="canUseTimer"></timer>
      <div v-if="page == 'tutorial'" class="">tutorial</div>
      <trainingPage v-if="page == 'training'"></trainingPage>
      <login v-if="page == 'login'" class="" @closeLogin="closeLogin"></login>
    </section>

    <!--<div class="col-3"></div>-->

  </main>
  <Cubo v-if="page=='timer' && selectedTipoCubo?.rendered" ref="cuboCmp" :autoPlayOnTurnsChange="true"></Cubo>
  <BootstrapAlert></BootstrapAlert>
  <SolveInfoModal></SolveInfoModal>
  
</template>

<style scoped>
header {
  margin-top: 10px;
  line-height: 1.5;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content:space-around;

  :first-child{
    display: flex;
    flex-direction: row;
    width:fit-content;
    >img{
      margin-top: 11px;
    }
  }

  >div{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

main{
  height: 80vh;
  max-height: 80vh;
}

.training-main {
  width: 100%;
}

.training-section {
  height: 100%;
  max-width: 100%;
  min-width: 0;
}

aside{
  height: 100%;
  max-height: 80%;
  margin-bottom: 20px;
}


Cubo{
  position: absolute;
  z-index: 10;
  display: block;
  visibility: visible;
  bottom: 5%;
  right: 0%;
  height: 100px;
}

:deep(.scene) {
  position: absolute;
  z-index: 10;
  display: block;
  visibility: visible;
  width: 500px;
  height: 500px;
  bottom: -100px;
  right: 50px;
  margin: 0px;
  transform: scale(0.6);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

