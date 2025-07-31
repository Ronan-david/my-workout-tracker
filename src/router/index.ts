import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Workout from '@/views/Workout.vue';
import History from '@/views/History.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/workout/:date?',
    name: 'Workout',
    component: Workout,
    props: true
  },
  {
    path: '/history',
    name: 'History',
    component: History
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});