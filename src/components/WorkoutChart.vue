<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedPeriod" @change="updateChart" class="period-select">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
    </div>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart, type ChartConfiguration, registerables } from 'chart.js';
import type { DailyWorkout } from '../types/workout';

Chart.register(...registerables);

const props = defineProps<{
  workouts: DailyWorkout[];
  title: string;
  type: 'volume' | 'frequency' | 'progress';
}>();

const chartCanvas = ref<HTMLCanvasElement>();
const selectedPeriod = ref(30);
let chartInstance: Chart | null = null;

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

watch(() => props.workouts, () => {
  updateChart();
}, { deep: true });

function initChart() {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  const data = getChartData();
  
  const config: ChartConfiguration = {
    type: 'line',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
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
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  };

  chartInstance = new Chart(ctx, config);
}

function updateChart() {
  if (!chartInstance) return;
  
  const data = getChartData();
  chartInstance.data = data;
  chartInstance.update();
}

function getChartData() {
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
      switch (props.type) {
        case 'volume':
          value = workout.exercises.reduce((total, ex) => 
            total + ex.sets.reduce((setTotal, set) => 
              setTotal + (set.reps * (set.weight || 1)), 0), 0);
          break;
        case 'frequency':
          value = workout.exercises.length;
          break;
        case 'progress':
          value = workout.exercises.reduce((total, ex) => 
            total + ex.sets.length, 0);
          break;
      }
    }

    dataPoints.push(value);
  }

  return {
    labels,
    datasets: [{
      label: getDatasetLabel(),
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
}

function getYAxisLabel(): string {
  switch (props.type) {
    case 'volume': return 'Total Volume (reps × weight)';
    case 'frequency': return 'Number of Exercises';
    case 'progress': return 'Total Sets';
    default: return '';
  }
}

function getDatasetLabel(): string {
  switch (props.type) {
    case 'volume': return 'Workout Volume';
    case 'frequency': return 'Exercise Count';
    case 'progress': return 'Sets Completed';
    default: return '';
  }
}
</script>

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

.period-select {
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #374151;

  &:focus {
    outline: none;
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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

  .chart-wrapper {
    height: 250px;
  }
}
</style>