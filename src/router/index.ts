import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/DashboardPage.vue';
import Workout from '@/views/WorkoutPage.vue';
import History from '@/views/HistoryPage.vue';

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
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});