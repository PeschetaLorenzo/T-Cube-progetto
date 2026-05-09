<script setup>
import { computed } from 'vue'
import { alertState } from './alert'

const alertClass = computed(() => `alert-${alertState.severity}`)
</script>

<template>
  <Transition name="alert-fade">
    <div
      v-if="alertState.visible"
      :class="['alert', alertClass, 'bootstrap-alert']"
      role="alert"
    >
      {{ alertState.text }}
    </div>
  </Transition>
</template>

<style scoped>
  
.bootstrap-alert {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1080;
  min-width: 280px;
  max-width: min(420px, calc(100vw - 2rem));
  margin: 0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

</style>
