<script setup>
import {ref} from 'vue'

import { getWpas, getBpas } from './js/controller'
import  '@/js/event'


import LogoMenu from './components/header/LogoMenu.vue'
import scramble from './components/header/Scramble.vue'
import btnScramble from './components/header/btnScramble.vue';

import asideTable from './components/timer/asideTable.vue'
import timer from './components/timer/timer.vue';


const scrambleCmp = ref(null)
var page = ref('timer')

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
  page.value = newPage
}

</script>

<template>
  <header>
    <div>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="130px" height="130px" />
      <LogoMenu :page="page" @pageChange="onPageChange"/>
    </div>
    <scramble ref="scrambleCmp"></scramble>
    <btnScramble @btnAction="onBtnEvent"></btnScramble>

  </header>
  <main class="row">
    <aside class="col-3">
      <asideTable v-if="page == 'timer'" class="ps-5 pe-5"></asideTable>

    </aside>
    <section class="col-7">
      <timer v-if="page == 'timer'" class="mr-3" :wpas="getWpas(false, true, true)" :bpas="getBpas(false, true, true)"></timer>
      <div v-if="page == 'tutorial'" class="">tutorial</div>
      <div v-if="page == 'training'" class="">training</div>
    </section>

    <div class="col-3"></div>

  </main>
  
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
}

main{
  height: 80vh;
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

