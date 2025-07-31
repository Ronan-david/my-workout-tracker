<template>
  <nav class="main-nav">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <Dumbbell :size="24" />
        <span>FitTracker</span>
      </router-link>
      
      <div class="nav-links">
        <router-link 
          to="/" 
          class="nav-link"
          active-class="active"
          exact
        >
          <Home :size="18" />
          <span>Dashboard</span>
        </router-link>
        
        <router-link 
          :to="`/workout/${today}`" 
          class="nav-link"
          active-class="active"
        >
          <Play :size="18" />
          <span>Workout</span>
        </router-link>
        
        <router-link 
          to="/history" 
          class="nav-link"
          active-class="active"
        >
          <BarChart3 :size="18" />
          <span>History</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dumbbell, Home, Play, BarChart3 } from 'lucide-vue-next';

const today = computed(() => new Date().toISOString().split('T')[0]);
</script>

<style lang="scss" scoped>
.main-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #2563EB;
  font-weight: 700;
  font-size: 1.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #1D4ED8;
  }
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #6B7280;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background: #F9FAFB;
  }

  &.active {
    color: #2563EB;
    background: #EBF4FF;
  }

  span {
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-links {
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;

    span {
      display: none;
    }
  }
}
</style>