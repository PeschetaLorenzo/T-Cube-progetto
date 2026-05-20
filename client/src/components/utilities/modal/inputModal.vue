<script setup>
import { ref, watch } from 'vue'
import FormInput from '../FormInput.vue'
import FormButton from '../FormInput.vue'
import { inputState, closeInputModal } from './showInputModal'

const m_scramble = ref(inputState.value)

watch(
    () => inputState.visible,
    (visible) => {
        if (visible) {
            m_scramble.value = inputState.value
        }
    }
)

watch(m_scramble, (value) => {
    inputState.value = value
})

const handleKeyPress = (e) => {
    inputState.value = m_scramble.value
    console.log(inputState.value)
    if (e.key === 'Enter') {
        closeInputModal()
    }
}

</script>
<template>
    
<Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="inputState.visible"
        class="solve-modal-overlay"
        role="presentation"
        @click.self="closeInputModal"
      >
        <article
          class="solve-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="solve-modal-title"
        >
          <header class="modal-header">
            <div>
              <p class="eyebrow"></p>
              <h2 id="solve-modal-title">Scramble</h2>
            </div>
            <button
              type="button"
              class="icon-button"
              aria-label="Chiudi scheda solve"
              @click="closeInputModal"
            >
              x
            </button>
          </header>

          <section ref="contentRef" class="modal-content">
                  <FormInput
            id="scramble"
            label="""
            v-model="m_scramble"
            type="textarea"
            placeholder="Inserisci il nuovo scramble"
            :disabled="false"
            @keypress="handleKeyPress"
        />
        </section>

        </article>
      </div>
    </Transition>
  </Teleport>
</template>


<style scoped>
.solve-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1090;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.42);
}

.solve-modal {
  width: min(620px, 100%);
  max-height: min(86vh, 760px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  background: var(--color-background);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.22);
}

.modal-header,
.modal-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
}

.modal-header {
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.eyebrow {
  margin: 0 0 0.1rem;
  color: var(--vueGreen);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

h2, h3, p {
  margin: 0;
}

h2 {
  color: var(--color-heading);
  font-size: 1.45rem;
  font-weight: 700;
}

h3 {
  margin-bottom: 0.55rem;
  color: var(--color-heading);
  font-size: 0.98rem;
  font-weight: 700;
}

.icon-button,
.primary-button,
.secondary-button {
  min-height: 2.35rem;
  border-radius: 6px;
  font-family: inherit;
  font-weight: 700;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.icon-button {
  width: 2.35rem;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-background);
  line-height: 1;
}

.icon-button:hover,
.icon-button:focus-visible,
.secondary-button:hover,
.secondary-button:focus-visible {
  color: var(--vueGreen);
  border-color: var(--vueGreen);
  background: hsla(160, 100%, 37%, 0.1);
}

.modal-content {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-width: auto;
  scrollbar-color: var(--vueGreen) var(--color-background-soft);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.info-row {
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
}

dt {
  color: var(--vueGreen);
  font-size: 0.78rem;
  font-weight: 700;
}

dd {
  margin: 0.25rem 0 0;
  color: var(--color-text);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.scramble-section,
.averages-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.scramble-section p {
  padding: 0.85rem;
  border-radius: 6px;
  color: var(--color-heading);
  background: var(--color-background-mute);
  font-family: Consolas, 'Courier New', monospace;
  overflow-wrap: anywhere;
}


ul {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

li:hover,
li:focus-visible, .scramble-section>p:hover {
  outline: none;
  background: hsla(160, 100%, 37%, 0.1);
  cursor: copy;
}

li span {
  color: var(--vueGreen);
  font-weight: 800;
}

li strong {
  color: var(--color-text);
  font-weight: 600;
  text-align: right;
}

.modal-actions {
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
}

.primary-button,
.secondary-button {
  padding: 0.65rem 1rem;
}

.primary-button {
  border: 1px solid var(--vueGreen);
  color: #fff;
  background: var(--vueGreen);
}

.primary-button:hover,
.primary-button:focus-visible {
  background: rgba(0, 189, 126, 0.82);
}

.secondary-button {
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-background);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .solve-modal-overlay {
    align-items: stretch;
  }

  .solve-modal {
    max-height: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
      width: 100%;
    }
}
</style>
