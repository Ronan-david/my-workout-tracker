<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  'page-change': [page: number];
}>();

const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};
</script>

<template>
  <div class="pagination">
    <button 
      @click="goToPreviousPage" 
      :disabled="currentPage <= 1"
      class="pagination__btn pagination__btn--prev"
    >
      <ChevronLeft :size="16" />
      Previous
    </button>
    
    <span class="pagination__info">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    
    <button 
      @click="goToNextPage" 
      :disabled="currentPage >= totalPages"
      class="pagination__btn pagination__btn--next"
    >
      Next
      <ChevronRight :size="16" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  &__btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: #F9FAFB;
      border-color: #9CA3AF;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__info {
    color: #6B7280;
    font-size: 0.875rem;
  }
}
</style>
