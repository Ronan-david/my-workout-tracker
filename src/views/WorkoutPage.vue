<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { 
  CheckCircle, Plus, Play 
} from 'lucide-vue-next';
import ExerciseCard from '@/components/ExerciseCard.vue';
import SetTracker from '@/components/SetTracker.vue';
import { mockExercises } from '@/services/graphql';
import { WorkoutStorageService } from '@/services/storage';
import type { Exercise, DailyWorkout, WorkoutExercise, WorkoutSet } from '@/types/workout';

const props = defineProps<{
  date?: string;
}>();

const router = useRouter();

const date = computed(() => props.date || new Date().toISOString().split('T')[0]);
const isToday = computed(() => date.value === new Date().toISOString().split('T')[0]);

const exercises = ref<Exercise[]>(mockExercises);
const selectedExercises = ref<Exercise[]>([]);
const currentWorkout = ref<DailyWorkout | null>(null);
const showExerciseSelection = ref(true);
const selectedCategory = ref('');
const selectedDifficulty = ref('');

const categories = computed(() => 
  [...new Set(exercises.value.map(e => e.category))]
);

const filteredExercises = computed(() => {
  return exercises.value.filter(exercise => {
    const categoryMatch = !selectedCategory.value || exercise.category === selectedCategory.value;
    const difficultyMatch = !selectedDifficulty.value || exercise.difficulty === selectedDifficulty.value;
    return categoryMatch && difficultyMatch;
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

function startWorkout() {
  if (selectedExercises.value.length === 0) return;

  const workoutExercises: WorkoutExercise[] = selectedExercises.value.map(exercise => ({
    exerciseId: exercise.id,
    exercise,
    sets: [],
    notes: ''
  }));

  currentWorkout.value = {
    id: Date.now().toString(),
    date: date.value,
    exercises: workoutExercises,
    completed: false
  };

  showExerciseSelection.value = false;
}

async function updateExerciseSets(exerciseId: string, sets: WorkoutSet[]) {
  if (!currentWorkout.value) return;

  const exerciseIndex = currentWorkout.value.exercises.findIndex(ex => ex.exerciseId === exerciseId);
  if (exerciseIndex >= 0) {
    currentWorkout.value.exercises[exerciseIndex].sets = sets;
  }
}

async function finishWorkout() {
  if (!currentWorkout.value) return;

  currentWorkout.value.completed = true;
  
  await saveWorkout();
  router.push('/');
}

async function saveWorkout() {
  if (currentWorkout.value) {
    await WorkoutStorageService.saveWorkout(currentWorkout.value);
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

onMounted(async () => {
  // Load existing workout for the date
  const existingWorkout = await WorkoutStorageService.getWorkoutByDate(date.value);
  if (existingWorkout) {
    currentWorkout.value = existingWorkout;
    showExerciseSelection.value = false;
  }
});
</script>

<template>
  <div class="workout-page">
    <header class="workout-header">
      <div class="workout-header-content">
        <h1>{{ isToday ? "Today's Workout" : `Workout - ${formatDate(date)}` }}</h1>
        <p v-if="currentWorkout">
          {{ currentWorkout.exercises.length }} exercises • 
          {{ totalSets }} sets completed
        </p>
      </div>

      <button 
        v-if="currentWorkout && currentWorkout.exercises.length > 0"
        @click="finishWorkout"
        class="finish-btn"
        :disabled="!hasCompletedSets"
      >
        <CheckCircle :size="18" />
        Finish Workout
      </button>
    </header>

    <div class="workout-content">
      <div v-if="!showExerciseSelection && currentWorkout?.exercises.length" class="active-workout">
        <div class="workout-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${workoutProgress}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ workoutProgress }}% Complete</span>
        </div>

        <div class="exercise-trackers">
          <SetTracker
            v-for="workoutExercise in currentWorkout.exercises"
            :key="workoutExercise.exerciseId"
            :exercise="workoutExercise.exercise"
            :initial-sets="workoutExercise.sets"
            @sets-updated="updateExerciseSets(workoutExercise.exerciseId, $event)"
          />
        </div>

        <button 
          @click="showExerciseSelection = true"
          class="add-exercise-btn"
        >
          <Plus :size="18" />
          Add Another Exercise
        </button>
      </div>

      <div v-else class="exercise-selection">
        <div class="selection-header">
          <h2>{{ currentWorkout?.exercises.length ? 'Add Exercise' : 'Choose Your Exercises' }}</h2>
          <p>Select exercises for your workout</p>
        </div>

        <div class="exercise-filters">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="(category, index) in categories" :key="index" :value="category">
              {{ category }}
            </option>
          </select>
          
          <select v-model="selectedDifficulty" class="filter-select">
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div class="exercises-grid">
          <ExerciseCard
            v-for="exercise in filteredExercises"
            :key="exercise.id"
            :exercise="exercise"
            :is-selected="isExerciseSelected(exercise.id)"
            @select="toggleExercise"
          />
        </div>

        <div v-if="selectedExercises.length > 0" class="selection-actions">
          <button @click="startWorkout" class="start-workout-btn">
            <Play :size="18" />
            Start Workout ({{ selectedExercises.length }} exercises)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workout {
  &-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    border-radius: 16px;
    color: white;
  }

  &-header-content {
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    p {
      opacity: 0.9;
      margin: 0;
      font-size: 1rem;
    }
  }

  &-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .progress-bar {
      flex: 1;
      height: 8px;
      background: #E5E7EB;
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #10B981 0%, #059669 100%);
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-weight: 600;
      color: #374151;
      min-width: 80px;
      text-align: right;
    }
  }
}

.finish-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: white;
  color: #10B981;
  border: none;
  border-radius: 12px;
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
}



.exercise-trackers {
  margin-bottom: 2rem;
}

.add-exercise-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #F3F4F6;
  color: #374151;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #E5E7EB;
    border-color: #9CA3AF;
  }
}

.selection-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1F2937;
    margin: 0 0 0.5rem;
  }

  p {
    color: #6B7280;
    font-size: 1.125rem;
    margin: 0;
  }
}

.exercise-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.selection-actions {
  position: sticky;
  bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.start-workout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1D4ED8;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  }
}

@media (max-width: 768px) {
  .workout {
    &-page {
      padding: 1rem;
    }

    &-progress {
      flex-direction: column;
      gap: 1rem;
      text-align: center;

      .progress-text {
        text-align: center;
      }
    }

    &-header {
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;

      .header-content h1 {
        font-size: 1.5rem;
      }
    }
  }

  .exercise-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .exercises-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>