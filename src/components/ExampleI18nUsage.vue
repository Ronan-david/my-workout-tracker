<template>
  <div class="i18n-example">
    <h2>{{ t('exercises.categories.chest') }} Exercises</h2>
    
    <!-- Example 1: Using helper functions with a specific exercise -->
    <div v-for="exercise in chestExercises" :key="exercise.id" class="exercise-example">
      <h3>{{ exercise.name }}</h3>
      <p><strong>Description:</strong> {{ getTranslatedExerciseDescription(exercise.id, t) }}</p>
      <p><strong>Category:</strong> {{ getTranslatedExerciseCategory(exercise.category, t) }}</p>
      <p><strong>Difficulty:</strong> {{ getTranslatedExerciseDifficulty(exercise.difficulty, t) }}</p>
      <p><strong>Target Muscles:</strong></p>
      <ul>
        <li v-for="muscle in exercise.targetMuscles" :key="muscle">
          {{ getTranslatedMuscle(muscle, t) }}
        </li>
      </ul>
    </div>

    <!-- Example 2: Direct translation usage -->
    <div class="categories-example">
      <h3>All Categories:</h3>
      <ul>
        <li>{{ t('exercises.categories.chest') }}</li>
        <li>{{ t('exercises.categories.legs') }}</li>
        <li>{{ t('exercises.categories.back') }}</li>
        <li>{{ t('exercises.categories.arm') }}</li>
      </ul>
    </div>

    <!-- Example 3: Difficulty levels -->
    <div class="difficulty-example">
      <h3>Difficulty Levels:</h3>
      <span class="difficulty-badge beginner">{{ t('exercises.difficulty.beginner') }}</span>
      <span class="difficulty-badge intermediate">{{ t('exercises.difficulty.intermediate') }}</span>
      <span class="difficulty-badge advanced">{{ t('exercises.difficulty.advanced') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  mockExercises,
  getTranslatedExerciseDescription,
  getTranslatedExerciseCategory,
  getTranslatedExerciseDifficulty,
  getTranslatedMuscle 
} from '@/services/graphql'

const { t } = useI18n()

// Filter chest exercises for example
const chestExercises = computed(() => 
  mockExercises.filter(exercise => exercise.category === 'chest')
)
</script>

<style scoped>
.i18n-example {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.exercise-example {
  background: #f8f9fa;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.categories-example, .difficulty-example {
  background: #fff;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.difficulty-badge.beginner {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-badge.intermediate {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-badge.advanced {
  background: #fee2e2;
  color: #991b1b;
}
</style>
