<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CheckCircle, Plus } from 'lucide-vue-next';
import type { Exercise, WorkoutSet } from '../types/workout';
import { useI18n } from 'vue-i18n';
import { CircleMinus } from 'lucide-vue-next';

const { exercise, initialSets} = defineProps<{
  exercise: Exercise;
  initialSets?: WorkoutSet[];
}>();

const emit = defineEmits<{
  setsUpdated: [sets: WorkoutSet[]];
  deleteExercise: [exercise: Exercise];Ò
}>();

const { t } = useI18n();

const createNewSet = (): WorkoutSet => {
  return {
    reps: 0,
    weight: 0,
    duration: 0,
    completedAt: new Date()
  };
}

const sets = ref<WorkoutSet[]>(
  initialSets?.length ? 
    initialSets : 
    [createNewSet()]
);

const completedSets = computed(() => 
  sets.value.filter(set => isSetCompleted(set)).length
);

const allSetsCompleted = computed(() => 
  sets.value.every(set => isSetCompleted(set)) && sets.value.length > 0
);

const handleSetChange = (index: number) => {
  const set = sets.value[index];
  if (set.reps > 0 && set.weight > 0) {
    set.completedAt = new Date();
  }
  
  emit('setsUpdated', sets.value.filter(s => isSetCompleted(s)));
}

const addSet = () => {
  sets.value.push(createNewSet());
}

const duplicateLastSet = () => {
  if (sets.value.length > 0) {
    const lastSet = sets.value[sets.value.length - 1];
    sets.value.push({ ...lastSet, completedAt: new Date() });
  }
};

const isSetCompleted = (set: WorkoutSet): boolean => {
  return set.reps > 0 && set.weight > 0;
};

const deleteExercise = () => {
  emit('deleteExercise', exercise)
}

watch(() => sets.value, () => {
  emit('setsUpdated', sets.value.filter(s => isSetCompleted(s)));
}, { deep: true });
</script>

<template>
  <div class="set-tracker">
    <div class="set-tracker__exercise-info">
      <div class="">
        <h3>{{ exercise.name }}</h3>
        <p>{{ exercise.description }}</p>
      </div>

      <div class="set-tracker__buttons">
        <button
          @click="deleteExercise"
          class="set-tracker__buttons--cancel"
        >
          <CircleMinus :size="18" />
        </button>
      </div>
    </div>

    <div class="set-tracker__container">
      <div v-for="(set, index) in sets" :key="index">
        <div 
          class="set-tracker__row"
          :class="{ completed: isSetCompleted(set) }"
        >
          <span class="set-tracker__number">{{ t('set-tracker.set') }} {{ index + 1 }}</span>
          
          <div class="set-tracker__inputs">
            <div class="input-group">
              <label>{{ t('set-tracker.reps') }}</label>
              <input 
                type="number" 
                v-model.number="set.reps" 
                @input="handleSetChange(index)"
                :min="0"
                class="set-tracker__select"
                :placeholder="t('set-tracker.select-reps')"
              />
            </div>

            <div class="input-group">
              <label>{{ t('set-tracker.weight') }}</label>
              <input 
                type="number" 
                v-model.number="set.weight" 
                @input="handleSetChange(index)"
                :min="0"
                class="set-tracker__select"
                :placeholder="t('set-tracker.select-weights')"
              />
            </div>
          </div>

          <div v-if="isSetCompleted(set)" class="set-tracker__complete">
            <CheckCircle :size="20" class="complete-icon" />
          </div>
        </div>
      </div>
    </div>
    

    <div class="set-tracker__summary">
      <p>{{ t('set-tracker.completed-sets', { completed: completedSets, total: sets.length }) }}</p>

      <div v-if="allSetsCompleted" class="set-tracker__summary-buttons">
        <button 
          @click="duplicateLastSet"
          class="add-set-btn"
        >
          <Plus :size="16" />
          {{ t('set-tracker.duplicate-set') }}
        </button>
        <button 
          @click="addSet"
          class="add-set-btn"
        >
          <Plus :size="16" />
            {{ t('set-tracker.add-set') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.set-tracker {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  &__exercise-info {
    display: flex;
    flex-direction: column-reverse;
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

  &__container {
    margin-bottom: 1.5rem;
  }

  &__row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
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

  &__number {
    font-weight: 600;
    color: #374151;
    min-width: 60px;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__select {
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

  &__complete {
    color: #10B981;
  }

  &__summary {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #E5E7EB;

    p {
      margin: 0;
      font-weight: 500;
      color: #374151;
    }

    &-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    button {
      background: white;
      border: none;
      cursor: pointer;
    }

    &--cancel {
      color: #db3113;
    }
  }
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

.complete-icon {
  color: #10B981;
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

@media (min-width: 768px) {
  .set-tracker {
    &__exercise-info {
      flex-direction: row;
      justify-content: space-between;
    }
    &__row {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }

    &__inputs {
      flex-direction: row;
      gap: 1rem;
      flex: 1;
    }

    &__summary {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &-buttons {
        flex-direction: row;
      }
    }
  }
}
</style>