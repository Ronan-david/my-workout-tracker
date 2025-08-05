<script setup lang="ts">
import { computed } from 'vue';
import { Play } from 'lucide-vue-next';
import EmptyWorkout from '@/components/EmptyWorkout.vue';
import WorkoutSection from '@/components/WorkoutSection.vue';
import LoadingComp from '@/components/LoadingComp.vue';
import { loading, error, allWorkouts } from '@/composables/fetchFirebaseDB';

const today = computed(() => new Date().toISOString().split('T')[0]);
</script>

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

    <div class="dashboard-content">
      <LoadingComp v-if="loading" />
      <p v-else-if="error" class="error-message">
        An error occurred while fetching workouts. Please try again later.
      </p>
      <EmptyWorkout v-else-if="allWorkouts.length === 0 && !loading && !error" :today />
      <WorkoutSection v-else :workouts="allWorkouts" />
    </div>
  </div>
</template>

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
}
</style>