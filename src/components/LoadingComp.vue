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

  @include spin;
}
</style>