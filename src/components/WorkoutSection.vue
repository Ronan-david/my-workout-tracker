<script setup lang="ts">
import type { DailyWorkout } from '@/types/workout';
import { computed, ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { workouts } = defineProps<{
  workouts: DailyWorkout[];
}>();

const { t } = useI18n();

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => 
  Math.ceil(workoutsInReversedDateOrder.value.length / itemsPerPage)
);

const workoutsInReversedDateOrder = computed(() => {
  return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const paginatedWorkouts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return workoutsInReversedDateOrder.value.slice(start, end);
});

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

const getTotalSets = (workout: DailyWorkout): number => {
  return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
}

</script>
<template>
  <div class="workout-section">
    <h2 class="workout-section__title">{{ t('workout.title') }}</h2>
    <div class="workout-section__list">
      <div 
        v-for="(workout, index) in paginatedWorkouts" 
        :key="index"
        class="workout-section__item"
      >
        <div class="workout-section__header">
          <div class="workout-section__date">
            <h3 class="workout-section__date-text">{{ formatDate(workout.date) }}</h3>
            <span class="workout-section__status" :class="{ 'workout-section__status--completed': workout.completed }">
              {{ workout.completed ? 'Completed' : 'In Progress' }}
            </span>
          </div>
          <div class="workout-section__stats">
            <span class="workout-section__stat">{{ t('workout.exercise', { count: workout.exercises.length }) }}</span>
            <span class="workout-section__stat">{{ t('workout.set', { count: getTotalSets(workout) }) }}</span>
          </div>
        </div>
        
        <div class="workout-section__exercises">
          <div 
            v-for="exercise in workout.exercises" 
            :key="exercise.exerciseId"
            class="workout-section__exercise"
          >
            <div class="workout-section__exercise-info">
              <span class="workout-section__exercise-name">{{ exercise.exercise.name }}</span>
              <span class="workout-section__exercise-sets">{{ t('workout.set', { count: exercise.sets.length }) }}</span>
            </div>
            <div class="workout-section__exercise-details">
              <span 
                v-for="(set, sIndex) in exercise.sets" 
                :key="sIndex"
                class="workout-section__set-detail"
              >
                {{ set.reps }}{{ set.weight ? ` × ${set.weight}kg` : '' }}{{ set.duration ? ` × ${set.duration}s` : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="workout-section__pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage <= 1"
        class="workout-section__page-btn workout-section__page-btn--prev"
      >
        <ChevronLeft :size="16" />
        Previous
      </button>
      
      <span class="workout-section__page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage >= totalPages"
        class="workout-section__page-btn workout-section__page-btn--next"
      >
        Next
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workout-section {
  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 1.5rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__item {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #E5E7EB;
  }

  &__date {
    // Container for date and status
  }

  &__date-text {
    margin: 0 0 0.25rem;
    color: #1F2937;
    font-size: 1.125rem;
    font-weight: 600;
  }

  &__status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    background: #FEF3C7;
    color: #92400E;

    &--completed {
      background: #D1FAE5;
      color: #065F46;
    }
  }

  &__stats {
    display: flex;
    gap: 1rem;
  }

  &__stat {
    color: #6B7280;
    font-size: 0.875rem;
  }

  &__exercises {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__exercise {
    // Container for each exercise
  }

  &__exercise-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  &__exercise-name {
    font-weight: 500;
    color: #374151;
  }

  &__exercise-sets {
    color: #6B7280;
    font-size: 0.875rem;
  }

  &__exercise-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__set-detail {
    background: #F3F4F6;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  &__page-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #F9FAFB;
      border-color: #9CA3AF;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__page-info {
    color: #6B7280;
    font-size: 0.875rem;
  }
}
</style>
