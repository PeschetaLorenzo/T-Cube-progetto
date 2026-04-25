<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  isEditing: Boolean,
  isLoading: Boolean,
  isMasked: Boolean
})

const emit = defineEmits(['update:modelValue', 'edit', 'save', 'cancel'])

const handleEdit = () => {
  emit('edit')
}

const handleSave = () => {
  emit('save')
}

const handleCancel = () => {
  emit('cancel')
}

const handleInput = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="profilo-field">
    <label class="field-label">{{ label }}</label>
    <div class="field-wrapper">
      <input
        v-if="isEditing"
        :value="modelValue"
        :type="type"
        class="field-input active"
        :disabled="isLoading"
        @input="handleInput($event.target.value)"
      />
      <span v-else class="field-value">
        {{ isMasked ? '••••••••' : modelValue }}
      </span>
      
      <button
        v-if="!isEditing"
        @click="handleEdit"
        class="edit-btn"
        title="Modifica"
        :disabled="isLoading"
      >
        ✎
      </button>
      <div v-else class="edit-actions">
        <button
          @click="handleSave"
          class="save-btn"
          :disabled="isLoading"
        >
          ✓
        </button>
        <button
          @click="handleCancel"
          class="cancel-btn"
          :disabled="isLoading"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profilo-field {
  margin-bottom: 2rem;
}

.field-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(24, 24, 24, 0.7);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(0, 189, 126, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 189, 126, 0.1);
}

.field-value {
  flex: 1;
  padding: 0.5rem;
  color: rgba(24, 24, 24, 0.8);
  font-size: 1rem;
}

.field-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgb(0, 189, 126);
  border-radius: 4px;
  font-size: 1rem;
  color: rgba(24, 24, 24, 0.8);
  background: white;
  transition: all 0.3s ease;
}

.field-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 189, 126, 0.2);
}

.field-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-btn {
  padding: 0.5rem 0.75rem;
  background: rgb(0, 189, 126);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.edit-btn:hover:not(:disabled) {
  background: rgb(0, 160, 107);
  transform: scale(1.05);
}

.edit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.save-btn {
  background: rgb(0, 189, 126);
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: rgb(0, 160, 107);
}

.cancel-btn {
  background: rgba(255, 0, 0, 0.2);
  color: rgb(200, 0, 0);
}

.cancel-btn:hover:not(:disabled) {
  background: rgba(255, 0, 0, 0.3);
}

.save-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (prefers-color-scheme: dark) {
  .field-label {
    color: rgba(235, 235, 235, 0.7);
  }

  .field-wrapper {
    background: rgba(0, 189, 126, 0.1);
    border-color: rgba(0, 189, 126, 0.15);
  }

  .field-value {
    color: rgba(235, 235, 235, 0.8);
  }

  .field-input {
    background: #1a1a1a;
    color: rgba(235, 235, 235, 0.8);
    border-color: rgb(0, 189, 126);
  }
}
</style>
