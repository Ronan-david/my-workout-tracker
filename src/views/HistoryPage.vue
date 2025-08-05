<script setup lang="ts">
import { Download, TrendingUp } from 'lucide-vue-next';
import WorkoutChart from '@/components/WorkoutChart.vue';
import WorkoutSection from '@/components/WorkoutSection.vue';
import { WorkoutStorageService } from '@/services/storage';
import LoadingComp from '@/components/LoadingComp.vue';

import { loading, error, allWorkouts } from '@/composables/fetchFirebaseDB';

const exportData = async () => {
  const dataStr = await WorkoutStorageService.exportData();
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `workout-history-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}
</script>

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

    <LoadingComp v-if="loading" />
    <p v-else-if="error" class="error-message">
      An error occurred while fetching workouts. Please try again later.
    </p>
    <div v-else-if="allWorkouts.length > 0" class="history-content">
      <div class="charts-section">
        <WorkoutChart
          :workouts="allWorkouts"
          title="Workout Volume Over Time"
          type="volume"
        />
        
        <div class="charts-row">
          <WorkoutChart
            :workouts="allWorkouts"
            title="Exercise Frequency"
            type="frequency"
          />
          <WorkoutChart
            :workouts="allWorkouts"
            title="Total Sets Progress"
            type="progress"
          />
        </div>
      </div>

      <WorkoutSection :workouts="allWorkouts" />
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