import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/DashboardPage.vue';
import Workout from '@/views/WorkoutPage.vue';
import History from '@/views/HistoryPage.vue';
import PowerliftingProgram from '@/views/PowerliftingProgramPage.vue';
import PowerliftingProgramCalculator from '@/views/PowerliftingProgramCalculator.vue';

const routes = [
  {
    path: '/my-workout-tracker',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/my-workout-tracker/workout/:date?',
    name: 'Workout',
    component: Workout,
    props: true
  },
  {
    path: '/my-workout-tracker/history',
    name: 'History',
    component: History
  },
  {
    path: '/my-workout-tracker/powerlifting-program',
    name: 'PowerliftingProgram',
    component: PowerliftingProgram
  },
  {
    path: '/my-workout-tracker/program-summary',
    name: 'ProgramSummary',
    component: PowerliftingProgramCalculator
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});