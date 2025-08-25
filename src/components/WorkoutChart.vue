<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Line } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import type { DailyWorkout } from '../types/workout';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler
} from 'chart.js';
import type { ChartData } from '@/types/chartData';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler
);

const props = defineProps<{
  workouts: DailyWorkout[];
  title: string;
  type: 'volume' | 'frequency' | 'progress';
}>();

const { t, locale } = useI18n();

const selectedExercise = ref('bench press');
const selectedPeriod = ref(30);

const chartData = ref<ChartData>({
  labels: [],
  datasets: []
});

const getYAxisLabel = (): string => {
  return t('workout-chart.axes.weight');
};

const getExerciseDisplayName = (exerciseKey: string): string => {
  if (exerciseKey === 'bench press') {
    return t('workout-chart.exercises.bench-press');
  } else if (exerciseKey === 'deadlifts') {
    return t('workout-chart.exercises.deadlifts');
  }
  return exerciseKey;
};

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: t('workout-chart.axes.date')
      },
      grid: {
        color: '#F3F4F6'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: getYAxisLabel()
      },
      beginAtZero: true,
      grid: {
        color: '#F3F4F6'
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
}));

watch([() => props.workouts, selectedExercise], () => {
  updateChartData();
}, { deep: true });

onMounted(() => {
  updateChartData();
});

const updateChartData = () => {
  const now = new Date();
  const startDate = new Date(now.getTime() - selectedPeriod.value * 24 * 60 * 60 * 1000);
  
  const filteredWorkouts = props.workouts.filter(workout => 
    new Date(workout.date) >= startDate
  );

  const labels: string[] = [];
  const dataPoints: number[] = [];

  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    // Use locale-aware date formatting
    const localeCode = locale.value === 'fr' ? 'fr-FR' : 'en-US';
    labels.push(new Date(d).toLocaleDateString(localeCode, { month: 'short', day: 'numeric' }));
    
    const workout = filteredWorkouts.find(w => w.date === dateStr);
    let value = 0;

    if (workout) {
      const exercise = workout.exercises.find(ex => ex.exercise.name.toLowerCase() === selectedExercise.value.toLowerCase());
      if (exercise) {
        value = Math.max(...exercise.sets.map(set => set.weight || 0));
      }
    }

    dataPoints.push(value);
  }

  const exerciseDisplayName = getExerciseDisplayName(selectedExercise.value);
  
  chartData.value = {
    labels,
    datasets: [{
      label: t('workout-chart.chart-labels.weight-progression', { exercise: exerciseDisplayName }),
      data: dataPoints,
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#2563EB',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };
};
</script>

<template>
  <div class="workout-chart">
    <div class="workout-chart__header">
      <h3 class="workout-chart__title">{{ title }}</h3>
      <div class="workout-chart__controls">
        <select v-model="selectedExercise" @change="updateChartData" class="workout-chart__select workout-chart__select--exercise">
          <option value="">{{ t('workout-chart.select-exercise') }}</option>
          <option value="bench press">{{ t('workout-chart.exercises.bench-press') }}</option>
          <option value="deadlifts">{{ t('workout-chart.exercises.deadlifts') }}</option>
        </select>
        <select v-model="selectedPeriod" @change="updateChartData" class="workout-chart__select workout-chart__select--period">
          <option value="7">{{ t('workout-chart.periods.last-7-days') }}</option>
          <option value="30">{{ t('workout-chart.periods.last-30-days') }}</option>
          <option value="90">{{ t('workout-chart.periods.last-90-days') }}</option>
        </select>
      </div>
    </div>
    <div class="workout-chart__wrapper">
      <Line
        v-if="selectedExercise && chartData.datasets.length > 0"
        :data="chartData"
        :options="chartOptions"
        class="workout-chart__canvas"
      />
      <div v-else class="workout-chart__no-data">
        <p v-if="!selectedExercise" class="workout-chart__message">{{ t('workout-chart.messages.select-exercise') }}</p>
        <p v-else class="workout-chart__message">{{ t('workout-chart.messages.no-data') }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.workout-chart {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__title {
    margin: 0;
    color: #1F2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  &__controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__select {
    padding: 0.5rem;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
    color: #374151;
    min-width: 150px;

    &:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  &__wrapper {
    height: 300px;
    position: relative;
  }

  &__canvas {
    width: 100%;
    height: 100%;
  }

  &__no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &__message {
    margin: 0;
    text-align: center;
    color: #6B7280;
    font-size: 1rem;
  }
}

@media (max-width: $bp-lg) {
  .workout-chart {
    &__header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    &__controls {
      flex-direction: column;
      gap: 0.5rem;
    }

    &__select {
      min-width: auto;
      width: 100%;
    }

    &__wrapper {
      height: 250px;
    }
  }
}
</style>
