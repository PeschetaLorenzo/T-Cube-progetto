<script setup>
import {ref} from 'vue'
import { onMounted } from 'vue'

import { getWpas, getBpas } from './js/controller'

import LogoMenu from './components/header/LogoMenu.vue'
import scramble from './components/header/Scramble.vue'
import btnScramble from './components/header/btnScramble.vue';

import asideTable from './components/timer/asideTable.vue'
import timer from './components/timer/timer.vue';

import login from './components/login/login.vue'
import Cubo from './components/Cubo.vue'


const scrambleCmp = ref(null)
const cuboCmp = ref(null)
var page = ref('timer')
var scrambleMoves = []


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
  if(newPage == 'login' && page.value == 'login')
    newPage = 'timer'
  page.value = newPage
}

function closeLogin(){
  page.value = 'timer'
}

function newScramble(newScramble)
{
  console.log(newScramble)
  scrambleMoves = newScramble
  
  // Apply the new scramble to the Cubo component
  if (cuboCmp.value) {
    cuboCmp.value.applyNewScramble(newScramble)
  }
}

</script>

<template>
  <header>
    <div>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="130px" height="130px" @click="onPageChange('login')"/>
      <LogoMenu :page="page" @pageChange="onPageChange"/>
    </div>
    <div  v-if="page == 'timer'">
      <scramble ref="scrambleCmp" @newScramble="newScramble"></scramble>
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
      <timer v-if="page == 'timer'" class="mr-3" :wpas="getWpas(false, true, true)" :bpas="getBpas(false, true, true)"></timer>
      <div v-if="page == 'tutorial'" class="">tutorial</div>
      <div v-if="page == 'training'" class="">training</div>
      <login v-if="page == 'login'" class="" @closeLogin="closeLogin"></login>
    </section>

    <div class="col-3"></div>

  </main>
  <Cubo ref="cuboCmp" :autoPlayOnTurnsChange="false"></Cubo>
  
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

Cubo{
  position: absolute;
  z-index: 10;
  display: block;
  visibility: visible;
  bottom: 0px;
  right: 0px;
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

