<script setup>
  defineProps({
    page:{
      type: String,
      required: true,
    },
  })
</script>

<template>
  <div class="greetings">
    <h1 class="green">- CUBE</h1>
    <h3>
      Diventa un cuber professionista
      <a v-if="page!='tutorial'" target="_self" rel="noopener" @click="$emit('pageChange', 'tutorial')">TUTORIAL</a>
      <a v-if="page!='training'" target="_self" rel="noopener" @click="$emit('pageChange', 'training')">TRAINING</a>
      <a v-if="page!='timer'" target="_self" rel="noopener" @click="$emit('pageChange', 'timer')">TIMER</a>
    </h3>
  </div>
</template>

<style scoped>
a{
  cursor: pointer;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: 5px;
}

h3 {
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  width: max-content;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
