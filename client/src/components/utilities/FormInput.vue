<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'keypress'])
</script>

<template>
  <div class="form-group">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      class="form-input"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @keypress="$emit('keypress', $event)"
    />
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: rgba(24, 24, 24, 0.8);
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(0, 189, 126, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #ffffff;
  color: var(--vt-c-text-light-1);
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: rgb(0, 189, 126);
  box-shadow: 0 0 0 3px rgba(0, 189, 126, 0.1);
  background-color: rgba(0, 189, 126, 0.02);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: rgba(0, 189, 126, 0.05);
}

@media (prefers-color-scheme: dark) {
  .form-label {
    color: rgba(235, 235, 235, 0.8);
  }

  .form-input {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--vt-c-text-dark-1);
    border-color: rgba(0, 189, 126, 0.2);
  }

  .form-input:focus {
    background-color: rgba(0, 189, 126, 0.08);
  }

  .form-input:disabled {
    background-color: rgba(0, 189, 126, 0.08);
  }
}
</style>
