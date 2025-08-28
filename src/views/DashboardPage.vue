<script setup lang="ts">
import { Play, Dumbbell } from 'lucide-vue-next';
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
      <div class="dashboard-page__programs">
        <h2 class="dashboard-page__programs-title">{{ t('dashboard-page.programs.title') }}</h2>
        <div class="dashboard-page__program-cards">
          <router-link 
            to="/my-workout-tracker/powerlifting-program"
            class="dashboard-page__program-card"
          >
            <div class="dashboard-page__program-icon">
              <Dumbbell :size="32" />
            </div>
            <div class="dashboard-page__program-info">
              <h3 class="dashboard-page__program-name">{{ t('dashboard-page.programs.powerlifting.name') }}</h3>
              <p class="dashboard-page__program-description">
                {{ t('dashboard-page.programs.powerlifting.description') }}
              </p>
            </div>
          </router-link>
        </div>
      </div>

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

  &__programs {
    margin: $space-10 0;
  }

  &__programs-title {
    font-size: $text-2xl;
    font-weight: $font-bold;
    margin: 0 0 $space-6;
    color: $text-primary;
    text-align: center;
  }

  &__program-cards {
    display: grid;
    gap: $space-6;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  &__program-card {
    display: flex;
    align-items: center;
    gap: $space-4;
    padding: $space-6;
    background: $white;
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    text-decoration: none;
    color: $text-primary;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px $shadow-light;

    &:hover {
      border-color: $primary-red;
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(229, 62, 62, 0.2);
    }
  }

  &__program-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, $primary-red 0%, #c53030 100%);
    border-radius: $radius-lg;
    color: $white;
    flex-shrink: 0;
  }

  &__program-info {
    flex: 1;
  }

  &__program-name {
    font-size: $text-lg;
    font-weight: $font-semibold;
    margin: 0 0 $space-2;
    color: $text-primary;
  }

  &__program-description {
    font-size: $text-sm;
    color: $text-secondary;
    margin: 0;
    line-height: 1.4;
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
