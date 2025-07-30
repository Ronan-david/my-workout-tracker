<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Welcome to your Vue 3 + TypeScript + Vite + SCSS SPA!')
const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div class="home">
    <div class="card">
      <h1>{{ message }}</h1>
      <p>This is a modern Vue.js 3 Single Page Application with:</p>
      <ul>
        <li>✅ Vue 3 with Composition API</li>
        <li>✅ TypeScript for type safety</li>
        <li>✅ SCSS for styling</li>
        <li>✅ Vue Router for navigation</li>
        <li>✅ Vite for fast development</li>
        <li>✅ ESLint + Prettier for code quality</li>
        <li>✅ Vitest for unit testing</li>
        <li>✅ Playwright for E2E testing</li>
        <li>❌ No Vuex (as requested)</li>
      </ul>
    </div>

    <div class="card">
      <h2>Interactive Counter</h2>
      <p>
        Current count: <strong>{{ count }}</strong>
      </p>
      <button class="btn" @click="increment">Increment</button>
      <button class="btn btn-secondary" @click="count = 0" style="margin-left: 1rem">Reset</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  ul {
    text-align: left;
    margin: 1rem 0;

    li {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }
  }
}
</style>
