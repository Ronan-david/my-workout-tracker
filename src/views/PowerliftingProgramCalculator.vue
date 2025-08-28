<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Dumbbell } from 'lucide-vue-next';
import type { ProgramExercise, WeekSchedule, DaySchedule } from '@/types/workout';

const { t } = useI18n();
const expandedWeek = ref<number | null>(null);

const toggleWeek = (week: number) => {
  expandedWeek.value = expandedWeek.value === week ? null : week;
};

const selectedExercises: ProgramExercise[] = [
    {
        "exercise": {
            "id": "1",
            "name": "Bench Press",
            "category": "chest",
            "description": "Compound chest pressing movement",
            "targetMuscles": [
                "chest",
                "triceps",
                "shoulders"
            ],
            "difficulty": "intermediate",
            "favorites": true,
            "powerlifting": "main"
        },
        "oneRepMax": 90,
        "selected": true
    },
    {
        "exercise": {
            "id": "2",
            "name": "Deadlifts",
            "category": "full-body",
            "description": "Complete posterior chain exercise",
            "targetMuscles": [
                "hamstrings",
                "glutes",
                "erector-spinae"
            ],
            "difficulty": "advanced",
            "favorites": true,
            "powerlifting": "main"
        },
        "oneRepMax": 95,
        "selected": true
    }
];

const WEEKS = 12;
const INITIAL_PERCENTAGES = [
  { day: 1, percentages: [72, 70] },
  { day: 2, percentages: [62] },
];

const programSchedule = computed(() => {
  const schedule: { week: number; weekSchedule: WeekSchedule[] }[] = [];

  for (let week = 1; week <= WEEKS; week++) {
    const weekSchedule: WeekSchedule[] = selectedExercises.map((exercise) => {
      const isMainExercise = exercise.exercise.powerlifting === 'main';
      const accessoryExercises = selectedExercises.filter(
        (e) => e.exercise.category === exercise.exercise.category && e.exercise.powerlifting === 'accessory'
      );

      const days: DaySchedule[] = INITIAL_PERCENTAGES.map((dayConfig) => {
        const percentages = dayConfig.percentages.map((percentage) => percentage + (week - 1) * 2);
        return {
          day: dayConfig.day,
          percentages,
          sets: isMainExercise ? [1, 4] : [3],
          reps: isMainExercise ? [1, 5] : [3],
          accessory: accessoryExercises,
          weights: percentages.map(percentage => Math.ceil((percentage / 100) * exercise.oneRepMax))
        };
      });

      return {
        exercise,
        days,
      };
    });

    schedule.push({ week, weekSchedule });
  }

  return schedule;
});
</script>

<template>
  <div class="program-calculator">
    <header class="program-calculator__header">
      <div class="program-calculator__header-content">
        <div class="program-calculator__header-icon">
          <Dumbbell :size="48" />
        </div>
        <div>
          <h1 class="program-calculator__header-title">{{ t('powerlifting-program.title') }}</h1>
          <div class="program-calculator__header-subtitles">
            <p
              v-for="exercise in selectedExercises"
              :key="exercise.exercise.id" 
              class="program-calculator__header-subtitle">
              {{ t('powerlifting-program.one-rep-max', { exercise: exercise.exercise.name, orm: exercise.oneRepMax }) }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <div
      v-for="week in programSchedule"
      :key="week.week"
      class="program-calculator__week"
    >
      <div
        class="program-calculator__week-header"
        @click="toggleWeek(week.week)"
      >
        <span class="program-calculator__week-header-title">
          {{ t('powerlifting-program.calculator.week', { week: week.week }) }}
        </span>
        <span
          :class="[
            'program-calculator__week-header-toggle',
            { 'program-calculator__week-header-toggle--expanded': expandedWeek === week.week }
          ]"
        >
          ▼
        </span>
      </div>
      <div
        :class="[
          'program-calculator__week-content',
          { 'program-calculator__week-content--expanded': expandedWeek === week.week }
        ]"
      >
        <div
          v-for="schedule in week.weekSchedule"
          :key="schedule.exercise.exercise.id"
          class="program-calculator__exercise"
        >
          <h3 class="program-calculator__exercise-title">
            {{ schedule.exercise.exercise.name }}
          </h3>
          <div
            v-for="day in schedule.days"
            :key="day.day"
            class="program-calculator__exercise-day"
          >
            <h4 class="program-calculator__exercise-day-title">
              {{ t('powerlifting-program.calculator.day', { day: day.day }) }}
            </h4>
            <ul class="program-calculator__exercise-day-details">
              <li
                v-for="(percentage, index) in day.percentages"
                :key="index"
              >
                {{ percentage }}% -> {{ day.weights[index] }}kg : {{ t('workout.set', { count: day.sets[index] }) }} x {{ t('workout.rep', { count: day.reps[index] }) }}
              </li>
            </ul>
            <div
              v-if="day.accessory.length"
              class="program-calculator__exercise-accessory"
            >
              <h5 class="program-calculator__exercise-accessory-title">
                {{ t('powerlifting-program.calculator.accessory') }}
              </h5>
              <ul class="program-calculator__exercise-accessory-list">
                <li
                  v-for="accessory in day.accessory"
                  :key="accessory.exercise.id"
                >
                  {{ accessory.exercise.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.program-calculator {
  margin: 0 auto;
  padding: $space-4;

  &__header {
    margin-bottom: $space-12;
    padding: $space-8;
    background: linear-gradient(135deg, $primary-red 0%, #c53030 100%);
    border-radius: $radius-xl;
    color: $white;

    &-content {
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      gap: $space-4;
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

    &-subtitles {
      display: flex;
      flex-direction: column;
      gap: $space-1;
    }

    &-subtitle {
      font-size: $text-lg;
      opacity: 0.9;
      margin: 0;
      line-height: 1.5;
    }
  }

  &__title {
    font-size: $text-2xl;
    margin-bottom: $space-4;
  }

  &__week {
    display: flex;
    flex-direction: column;
    margin-bottom: $space-8;
    background: $white;
    border-radius: $radius-lg;
    padding: $space-6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &-header {
      padding: $space-4;
      padding-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      &-title {
        margin: 0 0 $space-2;
        color: $text-primary;
        font-size: $text-lg;
        font-weight: $font-semibold;
      }

      &-toggle {
        font-size: $text-base;
        color: $text-secondary;
        transition: transform 0.2s ease;

        &--collapsed {
          transform: rotate(0deg);
        }
        &--expanded {
          transform: rotate(180deg);
        }
      }
    }

    &-content {
      padding: $space-4;
      display: none;

      &--expanded {
        display: flex;
        flex-direction: column;
        gap: $space-6;
      }
    }
  }

  &__exercise {
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: $radius-md;
    margin-bottom: $space-4;
    background-color: $white;

    &-title {
      font-size: $text-lg;
      font-weight: $font-bold;
      color: $text-primary;
      margin: 0;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid $gray-300;
      border: 2px solid $gray-200;
      border-radius: $radius-lg;
      padding: $space-6;
      transition: all 0.2s ease;
      background: $gray-50;
    }

    &-day {
      flex: 1;
      padding-left: $space-6;

      &-title {
        font-size: $text-base;
        font-weight: $font-semibold;
        color: $text-secondary;
        margin-bottom: $space-2;
        text-align: center;
      }

      &-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          background: $bg-muted;
          color: $text-secondary;
          padding: $space-1 $space-2;
          border-radius: $radius-sm;
          font-size: $text-xs;
          font-weight: $font-medium;
          font-size: $text-sm;
          color: $text-secondary;
          margin-bottom: $space-2;
        }
      }
    }

    &-accessory {
      margin-top: $space-4;

      &-title {
        font-size: $text-base;
        font-weight: $font-semibold;
        color: $text-primary;
        margin-bottom: $space-2;
      }

      &-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          font-size: $text-sm;
          color: $text-secondary;
          margin-bottom: $space-2;
        }
      }
    }
  }
}

@media (min-width: $bp-lg) {  
  .program-calculator {
    max-width: 800px;
    padding: $space-4;

    &__header {
      &-content {
        flex-direction: row;
      }

      &-subtitles {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    &__week {
      padding: $space-4;

      &-content {
        &--expanded {
          flex-direction: row;
        }
      }
    }

    &__exercise {
      flex-direction: column;

      &-day {
        padding-left: 0;
        border-right: none;
        margin-bottom: $space-4;
      }
    }
  }
}
</style>
