<script setup lang="ts">
import type { DailyWorkout } from '@/types/workout';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PaginationComp from './PaginationComp.vue';

const { workouts } = defineProps<{
  workouts: DailyWorkout[];
}>();

const { t, locale } = useI18n();

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => 
  Math.ceil(workouts.length / itemsPerPage)
);

const workoutsInReversedDateOrder = computed(() => {
  return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const paginatedWorkouts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return workoutsInReversedDateOrder.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return t('workout.date.today');
  } else if (dateStr === yesterday.toISOString().split('T')[0]) {
    return t('workout.date.yesterday');
  } else {
    const localeCode = locale.value === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(localeCode, { 
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
              {{ workout.completed ? t('workout.status.completed') : t('workout.status.in-progress') }}
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

    <PaginationComp 
      v-if="totalPages > 1" 
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.workout-section {
  &__title {
    font-size: $text-xl;
    font-weight: $font-semibold;
    color: $text-primary;
    margin: 0 0 $space-6;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    margin-bottom: $space-8;
  }

  &__item {
    background: $bg-primary;
    border-radius: $radius-lg;
    padding: $space-6;
    box-shadow: 0 2px 8px $shadow-light;
    transition: $transition-transform;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-4;
    padding-bottom: $space-4;
    border-bottom: 1px solid $gray-200;
  }

  &__date-text {
    margin: 0 0 $space-1;
    color: $text-primary;
    font-size: $text-lg;
    font-weight: $font-semibold;
  }

  &__status {
    padding: $space-1 $space-3;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: $font-medium;
    background: #FEF3C7;
    color: #92400E;

    &--completed {
      background: #D1FAE5;
      color: #065F46;
    }
  }

  &__stats {
    display: flex;
    gap: $space-4;
  }

  &__stat {
    color: $text-muted;
    font-size: $text-sm;
  }

  &__exercises {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__exercise-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-2;
  }

  &__exercise-name {
    font-weight: $font-medium;
    color: $text-secondary;
  }

  &__exercise-sets {
    color: $text-muted;
    font-size: $text-sm;
  }

  &__exercise-details {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__set-detail {
    background: $bg-muted;
    color: $text-secondary;
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    font-size: $text-xs;
    font-weight: $font-medium;
  }
}
</style>
