<template>
  <div class="set-tracker">
    <div class="exercise-info">
      <h3>{{ exercise.name }}</h3>
      <p>{{ exercise.description }}</p>
    </div>

    <div class="sets-container">
      <div 
        v-for="(set, index) in sets" 
        :key="set.id"
        class="set-row"
        :class="{ completed: set.reps > 0 }"
      >
        <span class="set-number">Set {{ index + 1 }}</span>
        
        <div class="set-inputs">
          <div class="input-group">
            <label>Reps</label>
            <select 
              v-model="set.reps"
              @change="handleSetChange(index)"
              class="set-select"
            >
              <option value="0">Select reps</option>
              <option v-for="n in 50" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <div v-if="needsWeight" class="input-group">
            <label>Weight (kg)</label>
            <select 
              v-model="set.weight"
              class="set-select"
            >
              <option value="0">Weight</option>
              <option v-for="w in weightOptions" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>

          <div v-if="needsDuration" class="input-group">
            <label>Duration (sec)</label>
            <select 
              v-model="set.duration"
              class="set-select"
            >
              <option value="0">Select time</option>
              <option v-for="t in durationOptions" :key="t" :value="t">{{ t }}s</option>
            </select>
          </div>
        </div>

        <div v-if="set.reps > 0" class="set-complete">
          <CheckCircle :size="20" class="complete-icon" />
        </div>
      </div>
    </div>

    <div class="set-summary">
      <p>Completed Sets: {{ completedSets }}/{{ sets.length }}</p>
      <button 
        v-if="allSetsCompleted && sets.length < 10" 
        @click="addSet"
        class="add-set-btn"
      >
        <Plus :size="16" />
        Add Another Set
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CheckCircle, Plus } from 'lucide-vue-next';
import type { Exercise, WorkoutSet } from '../types/workout';

const props = defineProps<{
  exercise: Exercise;
  initialSets?: WorkoutSet[];
}>();

const emit = defineEmits<{
  setsUpdated: [sets: WorkoutSet[]];
}>();

const sets = ref<WorkoutSet[]>(
  props.initialSets?.length ? 
    props.initialSets : 
    [createNewSet()]
);

const weightOptions = Array.from({ length: 50 }, (_, i) => (i + 1) * 2.5);
const durationOptions = [15, 30, 45, 60, 90, 120, 180, 240, 300];

const needsWeight = computed(() => 
  !['push-ups', 'pull-ups', 'planks', 'mountain climbers', 'burpees'].includes(
    props.exercise.name.toLowerCase()
  )
);

const needsDuration = computed(() => 
  ['planks', 'mountain climbers'].includes(props.exercise.name.toLowerCase())
);

const completedSets = computed(() => 
  sets.value.filter(set => set.reps > 0).length
);

const allSetsCompleted = computed(() => 
  sets.value.every(set => set.reps > 0) && sets.value.length > 0
);

function createNewSet(): WorkoutSet {
  return {
    id: Date.now().toString() + Math.random(),
    reps: 0,
    weight: 0,
    duration: 0,
    completedAt: new Date()
  };
}

function handleSetChange(index: number) {
  const set = sets.value[index];
  if (set.reps > 0) {
    set.completedAt = new Date();
    
    // Add new set if this was the last incomplete set
    if (index === sets.value.length - 1 && sets.value.length < 10) {
      sets.value.push(createNewSet());
    }
  }
  
  emit('setsUpdated', sets.value.filter(s => s.reps > 0));
}

function addSet() {
  if (sets.value.length < 10) {
    sets.value.push(createNewSet());
  }
}

watch(() => sets.value, () => {
  emit('setsUpdated', sets.value.filter(s => s.reps > 0));
}, { deep: true });
</script>

<style lang="scss" scoped>
.set-tracker {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.exercise-info {
  margin-bottom: 1.5rem;

  h3 {
    color: #1F2937;
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    color: #6B7280;
    margin: 0;
    font-size: 0.875rem;
  }
}

.sets-container {
  margin-bottom: 1.5rem;
}

.set-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: #F9FAFB;
  transition: all 0.2s ease;

  &.completed {
    background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%);
    border-left: 4px solid #10B981;
  }
}

.set-number {
  font-weight: 600;
  color: #374151;
  min-width: 60px;
}

.set-inputs {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.set-select {
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  min-width: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
}

.set-complete {
  color: #10B981;
}

.complete-icon {
  color: #10B981;
}

.set-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;

  p {
    margin: 0;
    font-weight: 500;
    color: #374151;
  }
}

.add-set-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #1D4ED8;
  }
}

@media (max-width: 768px) {
  .set-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .set-inputs {
    flex-direction: column;
    gap: 0.75rem;
  }

  .set-summary {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>