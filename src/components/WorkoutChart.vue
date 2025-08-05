<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Line } from 'vue-chartjs';
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

const selectedExercise = ref('bench press');
const selectedPeriod = ref(30);

const chartData = ref<ChartData>({
  labels: [],
  datasets: []
});

const chartOptions = {
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
        text: 'Date'
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
};

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

  // Generate date range
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    labels.push(new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    
    const workout = filteredWorkouts.find(w => w.date === dateStr);
    let value = 0;

    if (workout) {
      const exercise = workout.exercises.find(ex => ex.exercise.name.toLowerCase() === selectedExercise.value.toLowerCase());
      if (exercise) {
        // Get the maximum weight lifted in this session for this exercise
        value = Math.max(...exercise.sets.map(set => set.weight || 0));
      }
    }

    dataPoints.push(value);
  }

  chartData.value = {
    labels,
    datasets: [{
      label: `Weight Progression for ${selectedExercise.value}`,
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

function getYAxisLabel(): string {
  return 'Weight (lbs/kg)';
}
</script>

<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedExercise" @change="updateChartData" class="exercise-select">
          <option value="">Select Exercise</option>
          <option value="bench press">Bench Press</option>
          <option value="deadlifts">Deadlift</option>
        </select>
        <select v-model="selectedPeriod" @change="updateChartData" class="period-select">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
    </div>
    <div class="chart-wrapper">
      <Line
        v-if="selectedExercise && chartData.datasets.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="no-data-message">
        <p v-if="!selectedExercise">Please select an exercise to view progression</p>
        <p v-else>No data available for the selected exercise and period</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: #1F2937;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.chart-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.exercise-select,
.period-select {
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

.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6B7280;
  font-size: 1rem;

  p {
    margin: 0;
    text-align: center;
  }
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .chart-controls {
    flex-direction: column;
    gap: 0.5rem;
  }

  .exercise-select,
  .period-select {
    min-width: auto;
    width: 100%;
  }

  .chart-wrapper {
    height: 250px;
  }
}
</style>