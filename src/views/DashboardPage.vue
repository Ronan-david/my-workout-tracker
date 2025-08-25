<script setup lang="ts">
import { Play } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import EmptyWorkout from '@/components/EmptyWorkout.vue';
import WorkoutSection from '@/components/WorkoutSection.vue';
import LoadingComp from '@/components/LoadingComp.vue';
import { loading, error, allWorkouts } from '@/composables/fetchFirebaseDB';
import { today } from '@/composables/todayDate'

const { t } = useI18n()

const getLastThreeWorkouts = () => {
  return allWorkouts.value.slice(-3)
}
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-page__header">
      <div class="dashboard-page__header-content">
        <h1 class="dashboard-page__title">{{ t('dashboard-page.title') }}</h1>
        <p class="dashboard-page__subtitle">{{ t('dashboard-page.subtitle') }}</p>
      </div>
      <div class="dashboard-page__header-actions">
        <router-link 
          :to="`/my-workout-tracker/workout/${today}`" 
          class="dashboard-page__start-btn"
        >
          <Play :size="18" />
          {{ t('dashboard-page.buttons.start-today') }}
        </router-link>
      </div>
    </header>

    <div class="dashboard-page__content">
      <LoadingComp v-if="loading" />
      <p v-else-if="error" class="dashboard-page__error">
        {{ t('dashboard-page.error') }}
      </p>
      <EmptyWorkout v-else-if="allWorkouts.length === 0 && !loading && !error" :today />
      <WorkoutSection v-else :workouts="getLastThreeWorkouts()" />
      <div v-if="allWorkouts.length > 3" class="dashboard-page__history">
        <router-link class="dashboard-page__view-all-btn" to="/my-workout-tracker/history">
          {{ t('dashboard-page.buttons.view-all') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: $space-8;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-12;
    padding: $space-8;
    background: linear-gradient(135deg, $primary-blue 0%, $primary-blue-hover 100%);
    border-radius: $radius-xl;
    color: $white;
  }

  &__title {
    font-size: $text-4xl;
    font-weight: $font-bold;
    margin: 0 0 $space-2;
  }

  &__subtitle {
    font-size: $text-lg;
    opacity: 0.9;
    margin: 0;
  }

  &__start-btn {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-4 $space-6;
    background: $white;
    color: $primary-blue;
    text-decoration: none;
    border-radius: $radius-lg;
    font-weight: $font-semibold;
    font-size: $text-sm;
    transition: $transition-default;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px $shadow-medium;
    }
  }

  &__history {
    display: flex;
    justify-content: center;
  }

  &__view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-4 $space-8;
    background: $primary-blue;
    color: $white;
    border: none;
    border-radius: $radius-lg;
    font-weight: $font-semibold;
    font-size: $text-base;
    cursor: pointer;
    transition: $transition-default;
    text-decoration: none;

    &:hover {
      background: $primary-blue-hover;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px $shadow-blue;
    }
  }

  &__error {
    text-align: center;
    padding: $space-8;
    color: $error;
    background: $bg-muted;
    border: 1px solid $error-hover;
    border-radius: $radius-md;
    margin: $space-4 0;
  }
}

@media (max-width: $bp-lg) {
  .dashboard-page {
    padding: $space-4;

    &__header {
      flex-direction: column;
      gap: $space-6;
      text-align: center;
    }

    &__title {
      font-size: $text-3xl;
    }
  }
}
</style>
