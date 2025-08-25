<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import EmptyWorkout from '@/components/EmptyWorkout.vue';
import WorkoutSection from '@/components/WorkoutSection.vue';
import LoadingComp from '@/components/LoadingComp.vue';
import { loading, error, allWorkouts } from '@/composables/fetchFirebaseDB';
import { today } from '@/composables/todayDate'

const getLastThreeWorkouts = () => {
  return allWorkouts.value.slice(-3)
}
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-page__header">
      <div class="dashboard-page__header-content">
        <h1 class="dashboard-page__title">Workout Tracker</h1>
        <p class="dashboard-page__subtitle">Track your fitness journey with precision</p>
      </div>
      <div class="dashboard-page__header-actions">
        <router-link 
          :to="`/my-workout-tracker/workout/${today}`" 
          class="dashboard-page__start-btn"
        >
          <Play :size="18" />
          Start Today's Workout
        </router-link>
      </div>
    </header>

    <div class="dashboard-page__content">
      <LoadingComp v-if="loading" />
      <p v-else-if="error" class="dashboard-page__error">
        An error occurred while fetching workouts. Please try again later.
      </p>
      <EmptyWorkout v-else-if="allWorkouts.length === 0 && !loading && !error" :today />
      <WorkoutSection v-else :workouts="getLastThreeWorkouts()" />
      <div v-if="allWorkouts.length > 3" class="dashboard-page__history">
        <router-link class="dashboard-page__view-all-btn" to="/my-workout-tracker/history">View All Workouts</router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    border-radius: 16px;
    color: white;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }

  &__subtitle {
    font-size: 1.125rem;
    opacity: 0.9;
    margin: 0;
  }

  &__start-btn {
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

  &__history {
    display: flex;
    justify-content: center;
  }

  &__view-all-btn {
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
    text-decoration: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }
}

@media (max-width: $bp-lg) {
  .dashboard-page {
    padding: 1rem;

    &__header {
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }

    &__title {
      font-size: 2rem;
    }
  }
}
</style>
