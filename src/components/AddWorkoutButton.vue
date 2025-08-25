<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Plus, X } from 'lucide-vue-next';

const router = useRouter();
const { t } = useI18n();
const showCalendar = ref(false);
const dateInput = ref('');

const openCalendar = () => {
  showCalendar.value = true;
};

const closeCalendar = () => {
  showCalendar.value = false;
  dateInput.value = '';
};

const handleDateSubmit = () => {
  if (isValidDate.value) {
    showCalendar.value = false;
    router.push(`/my-workout-tracker/workout/${dateInput.value}`);
  }
};

const isValidDate = computed(() => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateInput.value)) {
    return false;
  }
  
  const date = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date.toISOString().split('T')[0] === dateInput.value && date <= today;
});

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
      {{ t('add-workout.button') }}
    </button>
    
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
            <h3>{{ t('add-workout.modal.title') }}</h3>
            <button @click="closeCalendar" class="close-button">
              <X :size="20" />
            </button>
          </div>
          
          <div class="modal-body">
            <p class="modal-description">
              {{ t('add-workout.modal.description') }}
            </p>
            <div class="input-section">
              <input 
                v-model="dateInput"
                type="text" 
                :placeholder="t('add-workout.modal.placeholder')"
                class="date-input"
              >
              <button 
                @click="handleDateSubmit" 
                :disabled="!isValidDate"
                class="add-date-btn"
              >
                {{ t('add-workout.modal.submit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.add-workout {
  &-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: $primary-green;
    color: $white;
    border: none;
    border-radius: $border-radius-lg;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: $transition-default;

    &:hover {
      background: $primary-green-hover;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px $shadow-green;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.modal {
  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $shadow-overlay;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: $z-modal;
    padding: 1rem;
  }

  &-content {
    background: $white;
    border-radius: $border-radius-xl;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 0;
    margin-bottom: 1rem;

    h3 {
      margin: 0;
      color: $gray-900;
      font-size: 1.25rem;
      font-weight: 600;
    }
  }

  &-body {
    padding: 0 1.5rem 1.5rem;
  }

  &-description {
    color: $gray-500;
    margin: 0 0 1.5rem;
    text-align: center;
    font-size: 0.875rem;
  }
}

.close {
  &-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: $gray-100;
    border-radius: $border-radius-sm;
    cursor: pointer;
    color: $gray-500;
    transition: $transition-default;

    &:hover {
      background: $gray-200;
      color: $gray-700;
    }
  }
}

.input {
  &-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.date {
  &-input {
    padding: 0.75rem;
    border: 1px solid $gray-300;
    border-radius: $border-radius-sm;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $primary-blue;
      box-shadow: 0 0 0 3px $shadow-blue;
    }

    &::placeholder {
      color: $gray-400;
    }
  }
}

.add-date {
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: $primary-green;
    color: $white;
    border: none;
    border-radius: $border-radius-sm;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: $transition-default;

    &:hover:not(:disabled) {
      background: $primary-green-hover;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: $gray-400;
    }
  }
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

@media (max-width: $mobile-breakpoint) {
  .modal {
    &-overlay {
      padding: 0.5rem;
    }

    &-content {
      max-height: 95vh;
    }

    &-header {
      padding: 1rem 1rem 0;
    }

    &-body {
      padding: 0 1rem 1rem;
    }
  }

  .add-workout {
    &-btn {
      padding: 0.875rem 1.25rem;
      font-size: 0.8rem;
    }
  }
}
</style>
