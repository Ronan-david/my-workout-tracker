<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Workout Tracker</h1>
        <p>Track your fitness journey with precision</p>
      </div>
      <div class="header-actions">
        <router-link 
          :to="`/workout/${today}`" 
          class="start-workout-btn"
        >
          <Play :size="18" />
          Start Today's Workout
        </router-link>
      </div>
    </header>

    <div class="dashboard-grid">
      <div class="stats-section">
        <h2>Quick Stats</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <Calendar />
            </div>
            <div class="stat-content">
              <h3>{{ workoutStreak }}</h3>
              <p>Day Streak</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <TrendingUp />
            </div>
            <div class="stat-content">
              <h3>{{ totalWorkouts }}</h3>
              <p>Total Workouts</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <Target />
            </div>
            <div class="stat-content">
              <h3>{{ averageExercises }}</h3>
              <p>Avg Exercises</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <Clock />
            </div>
            <div class="stat-content">
              <h3>{{ totalMinutes }}</h3>
              <p>Total Minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-section">
        <div class="section-header">
          <h2>Recent Workouts</h2>
          <router-link to="/history" class="view-all-link">
            View All
            <ChevronRight :size="16" />
          </router-link>
        </div>
        
        <div class="recent-workouts">
          <div 
            v-for="workout in recentWorkouts" 
            :key="workout.id"
            class="workout-card"
          >
            <div class="workout-date">
              <strong>{{ formatDate(workout.date) }}</strong>
              <span class="workout-duration">{{ workout.totalDuration }}min</span>
            </div>
            <div class="workout-exercises">
              <span 
                v-for="exercise in workout.exercises.slice(0, 3)" 
                :key="exercise.exerciseId"
                class="exercise-tag"
              >
                {{ exercise.exercise.name }}
              </span>
              <span 
                v-if="workout.exercises.length > 3" 
                class="exercise-tag more"
              >
                +{{ workout.exercises.length - 3 }} more
              </span>
            </div>
          </div>
          
          <div v-if="recentWorkouts.length === 0" class="empty-state">
            <Dumbbell :size="48" class="empty-icon" />
            <p>No workouts yet. Start your first workout today!</p>
            <router-link 
              :to="`/workout/${today}`" 
              class="start-first-workout-btn"
            >
              Start Your First Workout
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { 
  Play, Calendar, TrendingUp, Target, Clock, 
  ChevronRight, Dumbbell 
} from 'lucide-vue-next';
import { WorkoutStorageService } from '../services/storage';
import type { DailyWorkout } from '../types/workout';

const workouts = ref<DailyWorkout[]>([]);

const today = computed(() => new Date().toISOString().split('T')[0]);

const recentWorkouts = computed(() => 
  workouts.value.slice(0, 5)
);

const totalWorkouts = computed(() => workouts.value.length);

const workoutStreak = computed(() => {
  if (workouts.value.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (workouts.value.some(w => w.date === dateStr && w.completed)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
});

const averageExercises = computed(() => {
  if (workouts.value.length === 0) return 0;
  const total = workouts.value.reduce((sum, w) => sum + w.exercises.length, 0);
  return Math.round(total / workouts.value.length);
});

const totalMinutes = computed(() => 
  workouts.value.reduce((sum, w) => sum + w.totalDuration, 0)
);

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
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}

onMounted(async () => {
  const history = await WorkoutStorageService.getHistory();
  workouts.value = history.workouts;
});
</script>

<style lang="scss" scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
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

.start-workout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: white;
  color: #2563EB;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}

.dashboard-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
}

.stats-section, .recent-section {
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 1.5rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;

  .stat-icon {
    background: #EBF4FF;
    color: #2563EB;
    padding: 0.75rem;
    border-radius: 10px;
  }

  .stat-content {
    h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 0.25rem;
    }

    p {
      color: #6B7280;
      margin: 0;
      font-size: 0.875rem;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: #1D4ED8;
  }
}

.recent-workouts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workout-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .workout-date {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;

    strong {
      color: #1F2937;
      font-size: 1rem;
    }

    .workout-duration {
      color: #6B7280;
      font-size: 0.875rem;
    }
  }

  .workout-exercises {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .exercise-tag {
    background: #F3F4F6;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;

    &.more {
      background: #EBF4FF;
      color: #2563EB;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6B7280;

  .empty-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin-bottom: 1.5rem;
  }
}

.start-first-workout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #2563EB;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #1D4ED8;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;

    .header-content h1 {
      font-size: 2rem;
    }
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}
</style>