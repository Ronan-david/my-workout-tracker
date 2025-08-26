<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { 
  CheckCircle, CircleMinus, Plus, Play 
} from 'lucide-vue-next';
import ExerciseCard from '@/components/ExerciseCard.vue';
import SetTracker from '@/components/SetTracker.vue';
import { mockExercises, getTranslatedExerciseCategory } from '@/services/graphql';
import { WorkoutStorageService } from '@/services/storage';
import type { Exercise, DailyWorkout, WorkoutExercise, WorkoutSet } from '@/types/workout';

const props = defineProps<{
  date?: string;
}>();

const router = useRouter();
const { t, locale } = useI18n();

const date = computed(() => props.date || new Date().toISOString().split('T')[0]);
const isToday = computed(() => date.value === new Date().toISOString().split('T')[0]);

const exercises = ref<Exercise[]>(mockExercises);
const selectedExercises = ref<Exercise[]>([]);
const currentWorkout = ref<DailyWorkout | null>(null);
const showExerciseSelection = ref(true);
const selectedCategory = ref('');
const selectedDifficulty = ref('');
const showFavoritesOnly = ref(false);

const categories = computed(() => 
  [...new Set(exercises.value.map(e => e.category))]
);

const filteredExercises = computed(() => {
  return exercises.value.filter(exercise => {
    const categoryMatch = !selectedCategory.value || exercise.category === selectedCategory.value;
    const difficultyMatch = !selectedDifficulty.value || exercise.difficulty === selectedDifficulty.value;
    const favoritesMatch = !showFavoritesOnly.value || exercise.favorites;
    return categoryMatch && difficultyMatch && favoritesMatch;
  });
});

const totalSets = computed(() => {
  if (!currentWorkout.value) return 0;
  return currentWorkout.value.exercises.reduce((total, ex) => total + ex.sets.length, 0);
});

const workoutProgress = computed(() => {
  if (!currentWorkout.value || currentWorkout.value.exercises.length === 0) return 0;
  
  const totalExercises = currentWorkout.value.exercises.length;
  const exercisesWithSets = currentWorkout.value.exercises.filter(ex => ex.sets.length > 0).length;
  
  return Math.round((exercisesWithSets / totalExercises) * 100);
});

const hasCompletedSets = computed(() => {
  return currentWorkout.value?.exercises.some(ex => ex.sets.length > 0) || false;
});

function isExerciseSelected(exerciseId: string): boolean {
  return selectedExercises.value.some(ex => ex.id === exerciseId);
}

function toggleExercise(exercise: Exercise) {
  const index = selectedExercises.value.findIndex(ex => ex.id === exercise.id);
  if (index >= 0) {
    selectedExercises.value.splice(index, 1);
  } else {
    selectedExercises.value.push(exercise);
  }
}

const startWorkout = () => {
  if (selectedExercises.value.length === 0) return;

  const workoutExercises: WorkoutExercise[] = selectedExercises.value.map(exercise => ({
    exerciseId: exercise.id,
    exercise,
    sets: [],
    notes: ''
  }));

  currentWorkout.value = {
    date: date.value,
    exercises: workoutExercises,
    completed: false
  };

  showExerciseSelection.value = false;
}

const updateExerciseSets = async (exerciseId: string, sets: WorkoutSet[]) => {
  if (!currentWorkout.value) return;

  const exerciseIndex = currentWorkout.value.exercises.findIndex(ex => ex.exerciseId === exerciseId);
  if (exerciseIndex >= 0) {
    currentWorkout.value.exercises[exerciseIndex].sets = sets;
  }
}

const deleteExercise = (exercise: Exercise) => {
  if (!currentWorkout.value) return;

  const exerciseIndex = currentWorkout.value.exercises.findIndex(ex => ex.exerciseId === exercise.id);

  currentWorkout.value.exercises.splice(exerciseIndex, 1);
}

const finishWorkout = async () => {
  if (!currentWorkout.value) return;

  currentWorkout.value.completed = true;
  
  await saveWorkout();
  router.push('/my-workout-tracker');
}

const saveWorkout = async () => {
  if (currentWorkout.value) {
    await WorkoutStorageService.saveWorkout(currentWorkout.value);
  }
}

const cancelWorkout = () => {
  currentWorkout.value = null;
  showExerciseSelection.value = true;
  selectedExercises.value = [];
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<template>
  <div class="workout-page">
    <header class="workout-page__header">
      <div class="workout-page__header-content">
        <h1 class="workout-page__title">
          {{ isToday ? t('workout-page.title.today') : t('workout-page.title.date', { date: formatDate(date) }) }}
        </h1>
        <p v-if="currentWorkout" class="workout-page__stats">
          {{ t('workout-page.stats.exercises-and-sets', { exerciseCount: currentWorkout.exercises.length, setCount: totalSets }) }}
        </p>
      </div>

      <div v-if="currentWorkout && currentWorkout.exercises.length > 0" class="workout-page__header-actions">
        <button 
          @click="finishWorkout"
          class="workout-page__action-btn workout-page__action-btn--finish"
          :disabled="!hasCompletedSets"
        >
          <CheckCircle :size="18" />
          {{ t('workout-page.buttons.finish-workout') }}
        </button>
        <button
          @click="cancelWorkout"
          class="workout-page__action-btn workout-page__action-btn--cancel"
          :disabled="!hasCompletedSets"
        >
          <CircleMinus :size="18" />
          {{ t('workout-page.buttons.cancel-workout') }}
        </button>
      </div>
    </header>

    <div class="workout-page__content">
      <div v-if="!showExerciseSelection && currentWorkout?.exercises.length" class="workout-page__active">
        <div class="workout-page__progress">
          <div class="workout-page__progress-bar">
            <div 
              class="workout-page__progress-fill" 
              :style="{ width: `${workoutProgress}%` }"
            ></div>
          </div>
          <span class="workout-page__progress-text">{{ t('workout-page.progress.complete', { percent: workoutProgress }) }}</span>
        </div>

        <div class="workout-page__trackers">
          <SetTracker
            v-for="workoutExercise in currentWorkout.exercises"
            :key="workoutExercise.exerciseId"
            :exercise="workoutExercise.exercise"
            :initial-sets="workoutExercise.sets"
            @sets-updated="updateExerciseSets(workoutExercise.exerciseId, $event)"
            @delete-exercise="deleteExercise($event)"
          />
        </div>

        <button 
          @click="showExerciseSelection = true"
          class="workout-page__add-btn"
        >
          <Plus :size="18" />
          {{ t('workout-page.buttons.add-exercise') }}
        </button>
      </div>

      <div v-else class="workout-page__selection">
        <div class="workout-page__selection-header">
          <h2 class="workout-page__selection-title">
            {{ currentWorkout?.exercises.length ? t('workout-page.selection.title.add') : t('workout-page.selection.title.choose') }}
          </h2>
          <p class="workout-page__selection-subtitle">{{ t('workout-page.selection.subtitle') }}</p>
        </div>

        <div class="workout-page__filters">
          <select v-model="selectedCategory" class="workout-page__filter">
            <option value="">{{ t('workout-page.filters.all-categories') }}</option>
            <option v-for="(category, index) in categories" :key="index" :value="category">
              {{ getTranslatedExerciseCategory(category, t) }}
            </option>
          </select>
          
          <select v-model="selectedDifficulty" class="workout-page__filter">
            <option value="">{{ t('workout-page.filters.all-difficulties') }}</option>
            <option value="beginner">{{ t('workout-page.filters.beginner') }}</option>
            <option value="intermediate">{{ t('workout-page.filters.intermediate') }}</option>
            <option value="advanced">{{ t('workout-page.filters.advanced') }}</option>
          </select>
          
          <label class="workout-page__favorites-filter">
            <input 
              type="checkbox" 
              v-model="showFavoritesOnly" 
              class="workout-page__favorites-checkbox"
            />
            <span class="workout-page__favorites-label">Show favorites only</span>
          </label>
        </div>

        <div class="workout-page__exercises">
          <ExerciseCard
            v-for="exercise in filteredExercises"
            :key="exercise.id"
            :exercise="exercise"
            :is-selected="isExerciseSelected(exercise.id)"
            @select="toggleExercise"
          />
        </div>

        <div v-if="selectedExercises.length > 0" class="workout-page__selection-actions">
          <button @click="startWorkout" class="workout-page__start-btn">
            <Play :size="18" />
            {{ t('workout-page.buttons.start-workout', { count: selectedExercises.length }) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.workout-page {
  margin: 0 auto;
  padding: 1rem;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, $primary-green 0%, $primary-green-hover 100%);
    border-radius: $radius-xl;
    color: $white;
  }

  &__header-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  &__stats {
    opacity: 0.9;
    margin: 0;
    font-size: 1rem;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: $white;
    border: none;
    border-radius: $radius-lg;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--finish {
      color: $success;
    }

    &--cancel {
      color: $error;
    }
  }

  &__progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: $white;
    border-radius: $radius-lg;
    box-shadow: 0 2px 8px $shadow-light;
  }

  &__progress-bar {
    flex: 1;
    height: 8px;
    background: $gray-200;
    border-radius: $radius-sm;
    overflow: hidden;
    width: 100%;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary-green 0%, $primary-green-hover 100%);
    transition: width 0.3s ease;
  }

  &__progress-text {
    font-weight: 600;
    color: $text-secondary;
    min-width: 80px;
    text-align: center;
  }

  &__trackers {
    margin-bottom: 2rem;
  }

  &__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    background: $gray-100;
    color: $text-secondary;
    border: 2px dashed $gray-300;
    border-radius: $radius-lg;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-200;
      border-color: $gray-400;
    }
  }

  &__selection-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__selection-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0 0 0.5rem;

    @media (min-width: 768px) {
      font-size: 1.875rem;
    }
  }

  &__selection-subtitle {
    color: $text-muted;
    font-size: 1rem;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 1.125rem;
    }
  }

  &__filters {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  &__filter {
    padding: 0.75rem 1rem;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    background: $white;
    font-size: $text-sm;
    color: $text-secondary;
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: $primary-blue;
      box-shadow: 0 0 0 3px $shadow-blue;
    }
  }

  &__favorites-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    background: $white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: $favorite;
      background: $favorite-light;
    }
  }

  &__favorites-checkbox {
    margin: 0;
    width: 16px;
    height: 16px;
    accent-color: $favorite;
  }

  &__favorites-label {
    font-size: 0.875rem;
    color: $text-secondary;
    font-weight: 500;
    user-select: none;
  }

  &__exercises {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__selection-actions {
    position: sticky;
    bottom: 2rem;
    background: $white;
    padding: 1.5rem;
    border-radius: $radius-lg;
    box-shadow: 0 8px 32px $shadow-medium;
    text-align: center;
  }

  &__start-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: $primary-blue;
    color: $white;
    border: none;
    border-radius: $radius-lg;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $primary-blue-hover;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px $shadow-green;
    }
  }
}

@media (min-width: 768px) {
  .workout-page {
    max-width: 1200px;

    &__header {
      flex-direction: row;
    }

    &__header-actions {
      flex-direction: row;
    }

    &__progress {
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }

    &__progress-text {
      text-align: right;
    }

    &__filters {
      flex-direction: row;
    }

    &__exercises {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
  }
}
</style>
