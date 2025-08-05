<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';

</script>
<template>
   <LoaderCircle class="loader" :size="48" />
</template>

<style lang="scss" scoped>
.loader {
  display: block;
  margin: 0 auto;
  color: #2563EB;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
}
</style>