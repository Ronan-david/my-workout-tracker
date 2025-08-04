<script setup lang="ts">
import type { DailyWorkout } from '@/types/workout';
import { computed, ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const { workouts } = defineProps<{
  workouts: DailyWorkout[];
}>();

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => 
  Math.ceil(workouts.length / itemsPerPage)
);

const paginatedWorkouts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return workouts.slice(start, end);
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

const  getTotalSets = (workout: DailyWorkout): number => {
  return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
}

</script>
<template>
  <div class="workouts-section">
    <h2>Recent Workouts</h2>
    <div class="workouts-list">
      <div 
        v-for="(workout, index) in paginatedWorkouts" 
        :key="index"
        class="workout-item"
      >
        <div class="workout-header">
          <div class="workout-date">
            <h3>{{ formatDate(workout.date) }}</h3>
            <span class="workout-status" :class="{ completed: workout.completed }">
              {{ workout.completed ? 'Completed' : 'In Progress' }}
            </span>
          </div>
          <div class="workout-stats">
            <span class="stat">{{ workout.exercises.length }} exercises</span>
            <span class="stat">{{ getTotalSets(workout) }} sets</span>
          </div>
        </div>
        
        <div class="workout-exercises">
          <div 
            v-for="exercise in workout.exercises" 
            :key="exercise.exerciseId"
            class="exercise-summary"
          >
            <div class="exercise-info">
              <span class="exercise-name">{{ exercise.exercise.name }}</span>
              <span class="exercise-sets">{{ exercise.sets.length }} sets</span>
            </div>
            <div class="exercise-details">
              <span 
                v-for="(set, sIndex) in exercise.sets" 
                :key="sIndex"
                class="set-detail"
              >
                {{ set.reps }}{{ set.weight ? ` × ${set.weight}kg` : '' }}{{ set.duration ? ` × ${set.duration}s` : '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage <= 1"
        class="page-btn"
      >
        <ChevronLeft :size="16" />
        Previous
      </button>
      
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage >= totalPages"
        class="page-btn"
      >
        Next
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workouts-section {
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 1.5rem;
  }
}

.workouts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.workout-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.workout-date {
  h3 {
    margin: 0 0 0.25rem;
    color: #1F2937;
    font-size: 1.125rem;
    font-weight: 600;
  }
}

.workout-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #FEF3C7;
  color: #92400E;

  &.completed {
    background: #D1FAE5;
    color: #065F46;
  }
}

.workout-stats {
  display: flex;
  gap: 1rem;

  .stat {
    color: #6B7280;
    font-size: 0.875rem;
  }
}

.workout-exercises {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-summary {
  .exercise-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    .exercise-name {
      font-weight: 500;
      color: #374151;
    }

    .exercise-sets {
      color: #6B7280;
      font-size: 0.875rem;
    }
  }

  .exercise-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .set-detail {
      background: #F3F4F6;
      color: #374151;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.page-btn {
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

.page-info {
  color: #6B7280;
  font-size: 0.875rem;
}
</style>