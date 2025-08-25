<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, X } from 'lucide-vue-next';

const router = useRouter();
const showCalendar = ref(false);
const pastDate = ref('');

const openCalendar = () => {
  showCalendar.value = true;
};

const closeCalendar = () => {
  showCalendar.value = false;
};

const handleDateSelected = (date: string) => {
  showCalendar.value = false;
  router.push(`/my-workout-tracker/workout/${date}`);
};

const handleModalClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeCalendar();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeCalendar();
  }
};
</script>

<template>
  <div class="add-workout-button">
    <button @click="openCalendar" class="add-workout-btn">
      <Plus :size="18" />
      Add Past Workout
    </button>
    
    <!-- Modal Overlay -->
    <Teleport to="body">
      <div 
        v-if="showCalendar" 
        class="modal-overlay"
        @click="handleModalClick"
        @keydown="handleKeydown"
        tabindex="-1"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>Select a Date</h3>
            <button @click="closeCalendar" class="close-button">
              <X :size="20" />
            </button>
          </div>
          
          <div class="modal-body">
            <p class="modal-description">
              Write a date to add a workout for that day.
            </p>
            <div class="modal-input">
              <input v-model="pastDate" placeholder="2025-01-01">
              <button :disabled="!pastDate" @click="handleDateSelected(pastDate)" class="add-date-btn">
                <Plus :size="18" />
                Add workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.add-workout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.add-date-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:hover:not(:disabled) {
    background: #F9FAFB;
    border-color: #9CA3AF;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
}

.modal-body {
  padding: 0 1.5rem 1.5rem;
}

.modal-description {
  color: #6b7280;
  font-size: 0.875rem;
}

.modal-input {
  display: flex;
  gap: 0.5rem;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem 1rem 0;
  }
  
  .modal-body {
    padding: 0 1rem 1rem;
  }
  
  .add-workout-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.8rem;
  }
}
</style>
