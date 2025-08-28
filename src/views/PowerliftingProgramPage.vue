<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { CheckCircle, Dumbbell, TrendingUp } from 'lucide-vue-next';
import { mockExercises } from '@/services/graphql';
import type { ProgramExercise } from '@/types/workout';
import { 
  getTranslatedExerciseDescription,
} from '@/services/graphql';

const router = useRouter();
const { t } = useI18n();

const programExercises = ref<ProgramExercise[]>(
  mockExercises.map(exercise => ({
    exercise,
    oneRepMax: 0,
    selected: false
  }))
);

const formErrors = ref<Record<string, string>>({});

const selectedExercises = computed(() => 
  programExercises.value.filter(pe => pe.selected)
);

const mainLifts = computed(() => 
  programExercises.value.filter(pe => pe.exercise.powerlifting === 'main')
);

const accessoryLifts = computed(() => 
  programExercises.value.filter(pe => pe.exercise.powerlifting === 'accessory')
);

const isFormValid = computed(() => {
  const hasSelectedExercises = selectedExercises.value.length > 0;
  const allSelectedHaveORM = selectedExercises.value.every(pe => pe.oneRepMax > 0);
  return hasSelectedExercises && allSelectedHaveORM;
});

const toggleExercise = (exerciseId: string) => {
  const exerciseIndex = programExercises.value.findIndex(pe => pe.exercise.id === exerciseId);
  if (exerciseIndex >= 0) {
    programExercises.value[exerciseIndex].selected = !programExercises.value[exerciseIndex].selected;
    
    if (formErrors.value[exerciseId]) {
      delete formErrors.value[exerciseId];
    }
  }
};

const updateOneRepMax = (exerciseId: string, value: string) => {
  const exerciseIndex = programExercises.value.findIndex(pe => pe.exercise.id === exerciseId);
  if (exerciseIndex >= 0) {
    const numValue = parseFloat(value) || 0;
    programExercises.value[exerciseIndex].oneRepMax = numValue;
    
    if (formErrors.value[exerciseId]) {
      delete formErrors.value[exerciseId];
    }
  }
};

const validateForm = () => {
  formErrors.value = {};
  let isValid = true;

  if (selectedExercises.value.length === 0) {
    formErrors.value.general = t('powerlifting-program.validation.no-exercises');
    isValid = false;
  }

  selectedExercises.value.forEach(pe => {
    if (pe.oneRepMax <= 0) {
      formErrors.value[pe.exercise.id] = t('powerlifting-program.validation.invalid-orm');
      isValid = false;
    }
  });

  if (isValid) {
    createProgram();
  }
};

const createProgram = () => {
  const successTitle = t('powerlifting-program.success.title');
  const successMessage = t('powerlifting-program.success.message', { count: selectedExercises.value.length });
  alert(`${successTitle}\n\n${successMessage}`);
  router.push('/my-workout-tracker/program-summary');
};

const goBack = () => {
  router.push('/my-workout-tracker');
};
</script>

<template>
  <div class="powerlifting-page">
    <header class="powerlifting-page__header">
      <div class="powerlifting-page__header-content">
        <div class="powerlifting-page__header-icon">
          <Dumbbell :size="48" />
        </div>
        <div>
          <h1 class="powerlifting-page__header-title">{{ t('powerlifting-program.title') }}</h1>
          <p class="powerlifting-page__header-subtitle">
            {{ t('powerlifting-program.subtitle') }}
          </p>
        </div>
      </div>
    </header>

    <div class="powerlifting-page__content">
      <form @submit.prevent="validateForm" class="powerlifting-page__form">
        
        <div v-if="formErrors.general" class="powerlifting-page__error">
          {{ formErrors.general }}
        </div>

        <section class="powerlifting-page__section">
          <h2 class="powerlifting-page__section-title">
            <TrendingUp :size="24" />
            {{ t('powerlifting-program.sections.main-lifts.title') }}
          </h2>
          <p class="powerlifting-page__section-subtitle">
            {{ t('powerlifting-program.sections.main-lifts.subtitle') }}
          </p>
          
          <div class="powerlifting-page__exercises">
            <div 
              v-for="programExercise in mainLifts" 
              :key="programExercise.exercise.id"
              class="powerlifting-page__exercise-card"
              :class="{ 
                'powerlifting-page__exercise-card--selected': programExercise.selected,
                'powerlifting-page__exercise-card--error': formErrors[programExercise.exercise.id]
              }"
            >
              <div class="powerlifting-page__exercise-header">
                <label class="powerlifting-page__exercise-label">
                  <input 
                    type="checkbox"
                    :checked="programExercise.selected"
                    @change="toggleExercise(programExercise.exercise.id)"
                    class="powerlifting-page__exercise-checkbox"
                  />
                  <div class="powerlifting-page__exercise-info">
                    <h3 class="powerlifting-page__exercise-name">
                      {{ programExercise.exercise.name }}
                    </h3>
                    <p class="powerlifting-page__exercise-description">
                      {{ getTranslatedExerciseDescription(programExercise.exercise.id, t) }}
                    </p>
                  </div>
                </label>
              </div>

              <div 
                v-if="programExercise.selected" 
                class="powerlifting-page__orm-input"
              >
                <label class="powerlifting-page__orm-label">
                  {{ t('powerlifting-program.form.orm-label') }}
                  <input 
                    type="number"
                    min="1"
                    step="0.5"
                    :value="programExercise.oneRepMax || ''"
                    @input="updateOneRepMax(programExercise.exercise.id, ($event.target as HTMLInputElement).value)"
                    class="powerlifting-page__orm-field"
                    :class="{ 'powerlifting-page__orm-field--error': formErrors[programExercise.exercise.id] }"
                    :placeholder="t('powerlifting-program.form.orm-placeholder')"
                  />
                </label>
                <div v-if="formErrors[programExercise.exercise.id]" class="powerlifting-page__field-error">
                  {{ formErrors[programExercise.exercise.id] }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="powerlifting-page__section">
          <h2 class="powerlifting-page__section-title">
            <Dumbbell :size="24" />
            {{ t('powerlifting-program.sections.accessory-lifts.title') }}
          </h2>
          <p class="powerlifting-page__section-subtitle">
            {{ t('powerlifting-program.sections.accessory-lifts.subtitle') }}
          </p>
          
          <div class="powerlifting-page__exercises">
            <div 
              v-for="programExercise in accessoryLifts" 
              :key="programExercise.exercise.id"
              class="powerlifting-page__exercise-card"
              :class="{ 
                'powerlifting-page__exercise-card--selected': programExercise.selected,
                'powerlifting-page__exercise-card--error': formErrors[programExercise.exercise.id]
              }"
            >
              <div class="powerlifting-page__exercise-header">
                <label class="powerlifting-page__exercise-label">
                  <input 
                    type="checkbox"
                    :checked="programExercise.selected"
                    @change="toggleExercise(programExercise.exercise.id)"
                    class="powerlifting-page__exercise-checkbox"
                  />
                  <div class="powerlifting-page__exercise-info">
                    <h3 class="powerlifting-page__exercise-name">
                      {{ programExercise.exercise.name }}
                    </h3>
                    <p class="powerlifting-page__exercise-description">
                      {{ getTranslatedExerciseDescription(programExercise.exercise.id, t) }}
                    </p>
                  </div>
                </label>
              </div>

              <div 
                v-if="programExercise.selected" 
                class="powerlifting-page__orm-input"
              >
                <label class="powerlifting-page__orm-label">
                  {{ t('powerlifting-program.form.orm-label') }}
                  <input 
                    type="number"
                    min="1"
                    step="0.5"
                    :value="programExercise.oneRepMax || ''"
                    @input="updateOneRepMax(programExercise.exercise.id, ($event.target as HTMLInputElement).value)"
                    class="powerlifting-page__orm-field"
                    :class="{ 'powerlifting-page__orm-field--error': formErrors[programExercise.exercise.id] }"
                    :placeholder="t('powerlifting-program.form.orm-placeholder')"
                  />
                </label>
                <div v-if="formErrors[programExercise.exercise.id]" class="powerlifting-page__field-error">
                  {{ formErrors[programExercise.exercise.id] }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="powerlifting-page__actions">
          <button 
            type="button"
            @click="goBack"
            class="powerlifting-page__btn powerlifting-page__btn--secondary"
          >
            {{ t('powerlifting-program.buttons.cancel') }}
          </button>
          <button 
            type="submit"
            :disabled="!isFormValid"
            class="powerlifting-page__btn powerlifting-page__btn--primary"
          >
            <CheckCircle :size="20" />
            {{ t('powerlifting-program.buttons.create-program') }}
          </button>
        </div>

        <div v-if="selectedExercises.length > 0" class="powerlifting-page__summary">
          <h3 class="powerlifting-page__summary-title">{{ t('powerlifting-program.form.summary-title') }}</h3>
          <p class="powerlifting-page__summary-text">
            {{ t('powerlifting-program.form.summary-text', { count: selectedExercises.length }) }}
          </p>
          <ul class="powerlifting-page__summary-list">
            <li v-for="selectedExercises in selectedExercises" :key="selectedExercises.exercise.id" class="powerlifting-page__summary-item">
              <strong>{{ selectedExercises.exercise.name }}</strong>
              <span v-if="selectedExercises.oneRepMax > 0"> - {{ t('powerlifting-program.form.orm-display', { orm: selectedExercises.oneRepMax }) }}</span>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.powerlifting-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: $space-8;

  &__header {
    margin-bottom: $space-12;
    padding: $space-8;
    background: linear-gradient(135deg, $primary-red 0%, #c53030 100%);
    border-radius: $radius-xl;
    color: $white;

    &-content {
      display: flex;
      align-items: center;
      gap: $space-6;
    }

    &-icon {
      flex-shrink: 0;
      opacity: 0.9;
    }

    &-title {
      font-size: $text-3xl;
      font-weight: $font-bold;
      margin: 0 0 $space-2;
    }

    &-subtitle {
      font-size: $text-lg;
      opacity: 0.9;
      margin: 0;
      line-height: 1.5;
    }
  }

  &__form {
    background: $white;
    border-radius: $radius-xl;
    padding: $space-8;
    box-shadow: 0 4px 20px $shadow-light;
  }

  &__error {
    padding: $space-4;
    background: #fed7d7;
    color: #c53030;
    border: 1px solid #feb2b2;
    border-radius: $radius-md;
    margin-bottom: $space-6;
    font-weight: $font-medium;
  }

  &__section {
    margin-bottom: $space-10;

    &:last-of-type {
      margin-bottom: $space-8;
    }
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: $space-3;
    font-size: $text-xl;
    font-weight: $font-bold;
    margin: 0 0 $space-2;
    color: $text-primary;
  }

  &__section-subtitle {
    color: $text-secondary;
    margin: 0 0 $space-6;
    line-height: 1.5;
  }

  &__exercises {
    display: grid;
    gap: $space-4;
  }

  &__exercise-card {
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    padding: $space-6;
    transition: all 0.2s ease;
    background: $gray-50;

    &--selected {
      border-color: $primary-red;
      background: #fef5f5;
    }

    &--error {
      border-color: $error;
      background: #fef2f2;
    }

    &:hover {
      border-color: $gray-300;
    }

    &--selected:hover {
      border-color: #c53030;
    }
  }

  &__exercise-label {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    cursor: pointer;
    width: 100%;
  }

  &__exercise-checkbox {
    margin-top: $space-1;
    transform: scale(1.2);
    accent-color: $primary-red;
  }

  &__exercise-info {
    flex: 1;
  }

  &__exercise-name {
    font-size: $text-lg;
    font-weight: $font-semibold;
    margin: 0 0 $space-2;
    color: $text-primary;
  }

  &__exercise-description {
    color: $text-secondary;
    margin: 0;
    line-height: 1.4;
  }

  &__orm-input {
    margin-top: $space-4;
    padding-top: $space-4;
    border-top: 1px solid $gray-300;
  }

  &__orm-label {
    display: block;
    font-weight: $font-medium;
    color: $text-primary;
    margin-bottom: $space-2;
  }

  &__orm-field {
    width: 100%;
    max-width: 200px;
    padding: $space-3 $space-4;
    border: 2px solid $gray-300;
    border-radius: $radius-md;
    font-size: $text-base;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $primary-red;
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }

    &--error {
      border-color: $error;
    }

    &::placeholder {
      color: $text-muted;
    }
  }

  &__field-error {
    color: $error;
    font-size: $text-sm;
    margin-top: $space-2;
    font-weight: $font-medium;
  }

  &__actions {
    display: flex;
    gap: $space-4;
    justify-content: center;
    margin-bottom: $space-8;
    padding-top: $space-6;
    border-top: 1px solid $gray-200;
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-4 $space-6;
    border: none;
    border-radius: $radius-lg;
    font-weight: $font-semibold;
    font-size: $text-base;
    cursor: pointer;
    transition: all 0.2s ease;

    &--primary {
      background: $primary-red;
      color: $white;

      &:hover:not(:disabled) {
        background: #c53030;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(229, 62, 62, 0.3);
      }

      &:disabled {
        background: $gray-400;
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    &--secondary {
      background: $gray-100;
      color: $text-secondary;
      border: 2px solid $gray-300;

      &:hover {
        background: $gray-200;
        border-color: $gray-400;
      }
    }
  }

  &__summary {
    background: $gray-50;
    border: 1px solid $gray-200;
    border-radius: $radius-lg;
    padding: $space-6;
  }

  &__summary-title {
    font-size: $text-lg;
    font-weight: $font-semibold;
    margin: 0 0 $space-3;
    color: $text-primary;
  }

  &__summary-text {
    color: $text-secondary;
    margin: 0 0 $space-4;
  }

  &__summary-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__summary-item {
    padding: $space-2 0;
    border-bottom: 1px solid $gray-200;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: $text-primary;
    }

    span {
      color: $text-secondary;
      font-size: $text-sm;
    }
  }
}

@media (max-width: $bp-md) {
  .powerlifting-page {
    padding: $space-4;

    &__header-content {
      flex-direction: column;
      text-align: center;
      gap: $space-4;
    }

    &__title {
      font-size: $text-2xl;
    }

    &__subtitle {
      font-size: $text-base;
    }

    &__form {
      padding: $space-6;
    }

    &__actions {
      flex-direction: column;
    }

    &__btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
