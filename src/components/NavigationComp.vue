<script setup lang="ts">
import { computed } from 'vue';
import { Dumbbell, Home, Play, BarChart3 } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import LanguageSelector from '@/components/LanguageSelector.vue';

const { t } = useI18n();

const today = computed(() => new Date().toISOString().split('T')[0]);
</script>

<template>
  <nav class="nav--main">
    <div class="nav__container">
      <router-link to="/my-workout-tracker" class="nav__brand">
        <Dumbbell :size="24" />
        <span class="nav__title">FitTracker</span>
      </router-link>
      
      <div class="nav__actions">
        <div class="nav__links">
          <router-link 
            to="/my-workout-tracker" 
            class="nav__link"
            active-class="nav__link--active"
            exact
          >
            <Home :size="18" />
            <span>{{ t('nav.dashboard') }}</span>
          </router-link>
          
          <router-link 
            :to="`/my-workout-tracker/workout/${today}`" 
            class="nav__link"
            active-class="nav__link--active"
          >
            <Play :size="18" />
            <span>{{ t('nav.workout') }}</span>
          </router-link>
          
          <router-link 
            to="/my-workout-tracker/history" 
            class="nav__link"
            active-class="nav__link--active"
          >
            <BarChart3 :size="18" />
            <span>{{ t('nav.history') }}</span>
          </router-link>
        </div>
        
        <LanguageSelector />
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.nav {
  &--main {
    background: $white;
    box-shadow: 0 2px 8px $shadow-light;
    position: sticky;
    top: 0;
    z-index: $z-sticky;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $space-4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $space-16;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $space-2;
    text-decoration: none;
    color: $primary-blue;
    font-weight: $font-bold;
    font-size: $text-lg;
    transition: $transition-default;

    &:hover {
      color: $primary-blue-hover;
    }
  }

  &__title {
    display : none;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__links {
    display: flex;
    gap: $space-1;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    text-decoration: none;
    color: $gray-500;
    font-weight: $font-medium;
    border-radius: $radius-md;
    transition: $transition-default;

    &:hover {
      color: $gray-700;
      background: $gray-50;
    }

    &--active {
      color: $primary-blue;
      background: $shadow-blue;
    }

    span {
      font-size: $text-xs;
      display: none;
    }
  }
}

@media (min-width: $tablet-breakpoint) {
  .nav {
    &__container {
      padding: 0 $space-8;
    }

    &__brand {
      font-size: $text-xl;
    }

    &__title {
      display : inline;
    }

    &__actions {
      gap: $space-4;
    }

    &__links {
      gap: $space-2;
    }

    &__link {
      padding: $space-3 $space-4;

      span {
        display: inline;
        font-size: $text-sm;
      }
    }
  }
}
</style>
