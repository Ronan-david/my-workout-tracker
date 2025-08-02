<template>
  <div id="app">
    <Navigation />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import { onMounted } from 'vue';
import { fetchOnce } from '@/composables/fetchFirebaseDB';

onMounted(() => {
  fetchOnce();
})
</script>

<style lang="scss">
</style>