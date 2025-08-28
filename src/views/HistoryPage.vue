<script setup lang="ts">
import { Download, TrendingUp } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import WorkoutChart from '@/components/WorkoutChart.vue';
import WorkoutSection from '@/components/WorkoutSection.vue';
import AddWorkoutButton from '@/components/AddWorkoutButton.vue';
import { WorkoutStorageService } from '@/services/storage';
import LoadingComp from '@/components/LoadingComp.vue';

import { loading, error, allWorkouts } from '@/composables/fetchFirebaseDB';

const { t } = useI18n();

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
    <header class="history-page__header">
      <div class="history-page__header-content">
        <h1 class="history-page__title">{{ t('history-page.title') }}</h1>
        <p class="history-page__subtitle">{{ t('history-page.subtitle') }}</p>
      </div>
      <div class="history-page__header-actions">
        <button @click="exportData" class="history-page__export-btn">
          <Download :size="18" />
          {{ t('history-page.export-btn') }}
        </button>
        <AddWorkoutButton />
      </div>
    </header>

    <LoadingComp v-if="loading" />
    <p v-else-if="error" class="history-page__error">
      {{ t('history-page.error') }}
    </p>
    <div v-else-if="allWorkouts.length > 0" class="history-page__content">
      <div class="history-page__charts">
        <WorkoutChart
          :workouts="allWorkouts"
          :title="t('history-page.charts.volume-title')"
          type="volume"
        />
        
        <div class="history-page__charts-row">
          <WorkoutChart
            :workouts="allWorkouts"
            :title="t('history-page.charts.frequency-title')"
            type="frequency"
          />
          <WorkoutChart
            :workouts="allWorkouts"
            :title="t('history-page.charts.progress-title')"
            type="progress"
          />
        </div>
      </div>

      <WorkoutSection :workouts="allWorkouts" />
    </div>

    <div v-else class="history-page__empty">
      <TrendingUp :size="64" class="history-page__empty-icon" />
      <h2 class="history-page__empty-title">{{ t('history-page.empty.title') }}</h2>
      <p class="history-page__empty-text">{{ t('history-page.empty.text') }}</p>
      <router-link to="//my-workout-tracker" class="history-page__start-btn">
        {{ t('history-page.empty.button') }}
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
    border-radius: 16px;
    color: white;
  }

  &__header-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
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

  &__export-btn {
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

  &__charts {
    margin-bottom: 3rem;
  }

  &__charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    color: #6B7280;
  }

  &__empty-icon {
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  &__empty-title {
    margin: 0 0 1rem;
    color: #374151;
    font-size: 1.5rem;
  }

  &__empty-text {
    margin: 0 0 2rem;
    font-size: 1.125rem;
  }

  &__start-btn {
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
}

@media (max-width: $bp-lg) {
  .history-page {
    padding: 1rem;

    &__header {
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }

    &__title {
      font-size: 2rem;
    }

    &__header-actions {
      gap: 0.75rem;
      width: 100%;
    }

    &__charts-row {
      grid-template-columns: 1fr;
    }
  }
}
</style>
