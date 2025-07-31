<template>
  <div 
    class="exercise-card" 
    :class="{ selected: isSelected }"
    @click="$emit('select', exercise)"
  >
    <div class="exercise-header">
      <h3 class="exercise-name">{{ exercise.name }}</h3>
      <span class="difficulty-badge" :class="exercise.difficulty">
        {{ exercise.difficulty }}
      </span>
    </div>
    <p class="exercise-description">{{ exercise.description }}</p>
    <div class="muscle-tags">
      <span 
        v-for="muscle in exercise.targetMuscles" 
        :key="muscle"
        class="muscle-tag"
      >
        {{ muscle }}
      </span>
    </div>
    <div v-if="isSelected" class="selected-indicator">
      <CheckCircle :size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next';
import type { Exercise } from '../types/workout';

defineProps<{
  exercise: Exercise;
  isSelected: boolean;
}>();

defineEmits<{
  select: [exercise: Exercise];
}>();
</script>

<style lang="scss" scoped>
.exercise-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &.selected {
    border-color: #2563EB;
    background: linear-gradient(135deg, #EBF4FF 0%, white 100%);
  }
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.exercise-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  &.beginner {
    background: #D1FAE5;
    color: #065F46;
  }

  &.intermediate {
    background: #FEF3C7;
    color: #92400E;
  }

  &.advanced {
    background: #FEE2E2;
    color: #991B1B;
  }
}

.exercise-description {
  color: #6B7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.muscle-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.muscle-tag {
  background: #F3F4F6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.selected-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #2563EB;
}
</style>