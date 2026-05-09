<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'warning', 'info'].includes(value)
  }
})
</script>

<template>
  <div :class="['alert', `alert-${type}`]">
    {{ message }}
  </div>
</template>

<style scoped>
.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  border-left: 4px solid;
}

.alert-error {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border-left-color: #dc2626;
}

.alert-success {
  background-color: rgba(0, 189, 126, 0.1);
  color: rgb(0, 189, 126);
  border-left-color: rgb(0, 189, 126);
}

.alert-warning {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
  border-left-color: #eab308;
}

.alert-info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-left-color: #3b82f6;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-color-scheme: dark) {
  .alert-error {
    background-color: rgba(220, 38, 38, 0.15);
  }

  .alert-success {
    background-color: rgba(0, 189, 126, 0.15);
  }

  .alert-warning {
    background-color: rgba(234, 179, 8, 0.15);
  }

  .alert-info {
    background-color: rgba(59, 130, 246, 0.15);
  }
}
</style>
