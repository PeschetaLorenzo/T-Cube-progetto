<template>
  <div>
    <FormAlert v-if="training.lastSaveError" :message="training.lastSaveError" type="warning" />

    <TrainingCubePreview
      :rendererMoves="training.currentRendererMoves"
      :fallbackImage="currentAlgorithm?.imagePath"
      :alt="'Caso training'"
      :renderKey="renderKey"
    />

    <TrainingTimerPanel
      :phase="phase"
      :formattedTime="formattedTime"
      :lastSolveMs="lastSolveMs"
      :saving="training.saving"
      :enabled="timerEnabled"
    />

    <section class="stats-strip">
      <div>
        <span>Selezionati</span>
        <strong>{{ selectedCount }}/{{ totalAlgorithms }}</strong>
      </div>
      <div>
        <span>Best</span>
        <strong>{{ formatMs(bestTraining) }}</strong>
      </div>
      <div>
        <span>Media</span>
        <strong>{{ formatMs(mediaTraining) }}</strong>
      </div>
      <div>
        <span>Solve</span>
        <strong>{{ totalSolves }}</strong>
      </div>
    </section>
  </div>
</template>

<script setup>
// Props for all the values needed from parent
import FormAlert from '@/components/utilities/FormAlert.vue'
import TrainingCubePreview from './TrainingCubePreview.vue'
import TrainingTimerPanel from './TrainingTimerPanel.vue'
import { toRefs } from 'vue'

const props = defineProps({
  training: { type: Object, required: true },
  currentAlgorithm: { type: Object, required: false },
  renderKey: { type: String, required: true },
  phase: { type: String, required: true },
  formattedTime: { type: String, required: true },
  lastSolveMs: { type: [Number, null], required: false },
  timerEnabled: { type: Boolean, required: true },
  selectedCount: { type: Number, required: true },
  totalAlgorithms: { type: Number, required: true },
  bestTraining: { type: [Number, null], required: false },
  mediaTraining: { type: [Number, null], required: false },
  totalSolves: { type: Number, required: true },
  formatMs: { type: Function, required: true }
})
</script>

<style scoped>
.stats-strip {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}
.stats-strip div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.65rem 0.85rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
}
.stats-strip strong {
  color: var(--color-heading);
  font-size: 1.2rem;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.stats-strip span {
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 700;
  opacity: 0.72;
  text-transform: uppercase;
}
</style>
