<script setup lang="ts">
import { Dumbbell } from 'lucide-vue-next';

const { today } = defineProps<{
  today: string;
}>()
</script>

<template>
  <div class="empty-state">
    <Dumbbell :size="48" class="empty-icon" />
    <p>No workouts yet. Start your first workout today!</p>
    <router-link 
      :to="`/my-workout-tracker/workout/${today}`" 
      class="start-first-workout-btn"
    >
      Start Your First Workout
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6B7280;

  .empty-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin-bottom: 1.5rem;
  }
}

.start-first-workout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #2563EB;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #1D4ED8;
  }
}
</style>