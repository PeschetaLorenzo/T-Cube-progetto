<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    enum: ['primary', 'secondary', 'danger', 'success'],
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['button', 'submit', 'reset'],
    default: 'button'
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['action-btn', `btn-${variant}`]"
    @click="handleClick"
  >
    <span v-if="icon" class="icon">{{ icon }}</span>
    <span class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Primary Variant */
.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Secondary Variant */
.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(127, 140, 141, 0.3);
}

.btn-secondary:active:not(:disabled) {
  transform: translateY(0);
}

/* Danger Variant */
.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.btn-danger:active:not(:disabled) {
  transform: translateY(0);
}

/* Success Variant */
.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-success:active:not(:disabled) {
  transform: translateY(0);
}

.icon {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  display: inline-block;
}

/* Responsive */
@media (max-width: 640px) {
  .action-btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .icon {
    font-size: 14px;
  }
}
</style>
