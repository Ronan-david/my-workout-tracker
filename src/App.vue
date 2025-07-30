<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
// No script needed for this basic layout
</script>

<style scoped lang="scss">
main {
  text-align: center;
}
</style>
