<template>
  <div class="history-page">
    <header class="history-header">
      <div class="header-content">
        <h1>Workout History</h1>
        <p>Track your progress and achievements</p>
      </div>
      <div class="header-actions">
        <button @click="exportData" class="export-btn">
          <Download :size="18" />
          Export Data
        </button>
      </div>
    </header>

    <div v-if="workouts.length > 0" class="history-content">
      <div class="charts-section">
        <WorkoutChart
          :workouts="workouts"
          title="Workout Volume Over Time"
          type="volume"
        />
        
        <div class="charts-row">
          <WorkoutChart
            :workouts="workouts"
            title="Exercise Frequency"
            type="frequency"
          />
          <WorkoutChart
            :workouts="workouts"
            title="Total Sets Progress"
            type="progress"
          />
        </div>
      </div>

      <div class="workouts-section">
        <h2>Recent Workouts</h2>
        <div class="workouts-list">
          <div 
            v-for="workout in paginatedWorkouts" 
            :key="workout.id"
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
                <span class="stat">{{ workout.totalDuration }}min</span>
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
                    v-for="(set, index) in exercise.sets" 
                    :key="set.id"
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
    </div>

    <div v-else class="empty-history">
      <TrendingUp :size="64" class="empty-icon" />
      <h2>No Workout History Yet</h2>
      <p>Start tracking your workouts to see your progress over time.</p>
      <router-link to="/" class="start-tracking-btn">
        Start Your First Workout
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { 
  Download, TrendingUp, ChevronLeft, ChevronRight 
} from 'lucide-vue-next';
import WorkoutChart from '../components/WorkoutChart.vue';
import { WorkoutStorageService } from '../services/storage';
import type { DailyWorkout } from '../types/workout';

const workouts = ref<DailyWorkout[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => 
  Math.ceil(workouts.value.length / itemsPerPage)
);

const paginatedWorkouts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return workouts.value.slice(start, end);
});

function formatDate(dateStr: string): string {
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

function getTotalSets(workout: DailyWorkout): number {
  return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
}

async function exportData() {
  const dataStr = await WorkoutStorageService.exportData();
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `workout-history-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

onMounted(async () => {
  const history = await WorkoutStorageService.getHistory();
  workouts.value = history.workouts;
});
</script>

<style lang="scss" scoped>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
  border-radius: 16px;
  color: white;

  .header-content {
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    p {
      font-size: 1.125rem;
      opacity: 0.9;
      margin: 0;
    }
  }
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: white;
  color: #7C3AED;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}

.charts-section {
  margin-bottom: 3rem;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

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

.empty-history {
  text-align: center;
  padding: 4rem 2rem;
  color: #6B7280;

  .empty-icon {
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  h2 {
    margin: 0 0 1rem;
    color: #374151;
    font-size: 1.5rem;
  }

  p {
    margin: 0 0 2rem;
    font-size: 1.125rem;
  }
}

.start-tracking-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #2563EB;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #1D4ED8;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  }
}

@media (max-width: 768px) {
  .history-page {
    padding: 1rem;
  }

  .history-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;

    .header-content h1 {
      font-size: 2rem;
    }
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .workout-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .workout-stats {
    justify-content: space-between;
  }
}
</style>