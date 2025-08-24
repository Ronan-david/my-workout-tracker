import { computed } from 'vue';

export const today = computed(() => new Date().toISOString().split('T')[0]);