<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  letter-spacing: 0.5px;
  font-family: inherit;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, rgb(0, 189, 126) 0%, rgba(0, 189, 126, 0.8) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 189, 126, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 189, 126, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  color: rgb(0, 189, 126);
  border: 2px solid rgb(0, 189, 126);
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(0, 189, 126, 0.1);
  transform: translateY(-2px);
}

.btn-secondary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
