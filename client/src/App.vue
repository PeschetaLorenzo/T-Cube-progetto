<script setup>
import {ref, watch, onMounted, onBeforeUnmount, computed} from 'vue'

import { getWpas, getBpas, getTipiCubo, getUserSolves} from './js/controller'
import { useTimerStore } from '@/stores/timer'

import LogoMenu from './components/header/LogoMenu.vue'
import scramble from './components/header/Scramble.vue'
import btnScramble from './components/header/btnScramble.vue';

import SelectVisual from './components/utilities/SelectVisual.vue'
import BootstrapAlert from './components/utilities/BootstrapAlert.vue'

import asideTable from './components/timer/asideTable.vue'
import timer from './components/timer/timer.vue';

import login from './components/login/login.vue'
import Cubo from './components/Cubo.vue'


var tipiCubo = ref([])

// Computed properties per la select
const tipiCuboTexts = computed(() => tipiCubo.value.map(opt => opt.desctipo))
const tipiCuboValues = computed(() => tipiCubo.value.map(opt => opt.idtipo))

// Tipo di cubo selezionato - oggetto completo con tutti i dati
const selectedTipoCubo = computed(() => {
  sessionStorage.setItem('tipoCubo', JSON.stringify(tipiCubo.value[tipoCuboModel.value-1]))
  getUserSolves()
  return tipiCubo.value[tipoCuboModel.value-1]
})

const scrambleCmp = ref(null)
const cuboCmp = ref(null)
var page = ref('timer')
var scrambleMoves = []
var previousPhase = ref('idle')
var tipoCuboModel = ref(1)
const bpas = ref([])
const wpas = ref([])

const timerStore = useTimerStore();

function updatePossibleAvgs() {
  bpas.value = getBpas(false, true, true)
  wpas.value = getWpas(false, true, true)
}

function  onBtnEvent(action) {
  const cmp = scrambleCmp.value
  if (!cmp) return

  switch(action)
  {
    case 'generate':
      cmp.generateScramble()
      break;

    case 'oldScramble':
      if(cmp.prevScramble[cmp.prevScramble.length-1].length != 0)
        cmp.oldScramble()
      break;
  }
}

function onPageChange(newPage)
{
  if(timerStore.phase == 'idle')
  {
    if(newPage == 'login' && page.value == 'login')
      newPage = 'timer'
    page.value = newPage
  } 
}

function closeLogin(){
  page.value = 'timer'
}

function newScramble(newScramble)
{
  console.log(newScramble)
  scrambleMoves = newScramble
  timerStore.scramble = scrambleMoves

  if (cuboCmp.value) {
    cuboCmp.value.applyNewScramble(newScramble)
  }
}

onMounted(async () => {
  tipiCubo.value = await getTipiCubo()
  console.log('Tipi di cubo caricati:', tipiCubo.value)
  console.log('Tipo di cubo selezionato:', selectedTipoCubo.value)

  updatePossibleAvgs()
  window.addEventListener('solves-updated', updatePossibleAvgs)
})

onBeforeUnmount(() => {
  window.removeEventListener('solves-updated', updatePossibleAvgs)
})

// Watch for timer phase changes - auto-generate scramble when timer stops
watch(() => timerStore.phase, (newPhase, oldPhase) => {
  if (oldPhase === 'running' && newPhase === 'idle' && scrambleCmp.value) {
    // Timer just stopped, automatically generate new scramble
    scrambleCmp.value.generateScramble()
  }
  previousPhase.value = newPhase
})

// When the cube is rendered after the first scramble was generated,
// apply the latest scramble that App.vue already received.
watch(cuboCmp, (cmp) => {
  if (cmp && scrambleMoves.length > 0) {
    cmp.applyNewScramble(scrambleMoves)
  }
}, { flush: 'post' })

watch(tipoCuboModel, () => {
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
        <scramble v-if="selectedTipoCubo?.scrambled" ref="scrambleCmp" @newScramble="newScramble"></scramble>
      </div>
      <btnScramble @btnAction="onBtnEvent"></btnScramble>
    </div>
    <div  v-if="page != 'timer'">

    </div>

  </header>
  <main class="row">
    <aside class="col-3">
      <asideTable v-if="page == 'timer'" class="ps-3 pe-5"></asideTable>

    </aside>
    <section class="col-7">
      <timer v-if="page == 'timer'" class="mr-3" :wpas="wpas" :bpas="bpas"></timer>
      <div v-if="page == 'tutorial'" class="">tutorial</div>
      <div v-if="page == 'training'" class="">training</div>
      <login v-if="page == 'login'" class="" @closeLogin="closeLogin"></login>
    </section>

    <div class="col-3"></div>

  </main>
  <Cubo v-if="page=='timer' && selectedTipoCubo?.rendered" ref="cuboCmp" :autoPlayOnTurnsChange="true"></Cubo>
  <BootstrapAlert></BootstrapAlert>
  
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

