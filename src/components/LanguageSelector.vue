<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Globe, ChevronDown } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const showLanguageDropdown = ref(false);

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === locale.value) || languages[0];
});

const switchLanguage = (langCode: string) => {
  locale.value = langCode;
  showLanguageDropdown.value = false;
};

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value;
};

const closeDropdownOnClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.language-selector')) {
    showLanguageDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside);
});
</script>

<template>
  <div class="language-selector">
    <button 
      @click="toggleLanguageDropdown"
      class="language-button"
      :class="{ 'language-button--active': showLanguageDropdown }"
    >
      <Globe :size="18" />
      <span class="language-text">{{ currentLanguage.flag }} {{ currentLanguage.name }}</span>
      <ChevronDown :size="16" class="chevron" :class="{ 'chevron--rotated': showLanguageDropdown }" />
    </button>
    
    <div v-if="showLanguageDropdown" class="language-dropdown">
      <button 
        v-for="language in languages"
        :key="language.code"
        @click="switchLanguage(language.code)"
        class="language-option"
        :class="{ 'language-option--active': language.code === locale }"
      >
        <span class="flag">{{ language.flag }}</span>
        <span>{{ language.name }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.language {
  &-selector {
    position: relative;
  }

  &-button {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-3;
    background: transparent;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    color: $gray-500;
    font-weight: $font-medium;
    cursor: pointer;
    transition: $transition-default;
    font-size: $text-sm;

    &:hover {
      color: $gray-700;
      background: $gray-50;
      border-color: $gray-300;
    }

    &--active {
      color: $primary-blue;
      border-color: $primary-blue;
      background: $shadow-blue;
    }
  }

  &-text {
    display: none; 
  }

  &-dropdown {
    position: absolute;
    top: 100%;
    right: -$space-4;
    margin-top: $space-2;
    background: $white;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    box-shadow: 0 4px 12px $shadow-medium;
    z-index: $z-dropdown;
    min-width: 140px;
    overflow: hidden;
  }

  &-option {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    width: 100%;
    background: transparent;
    border: none;
    color: $gray-700;
    cursor: pointer;
    transition: $transition-default;
    font-size: $text-sm;
    text-align: left;

    &:hover {
      background: $gray-50;
    }

    &--active {
      background: $shadow-blue;
      color: $primary-blue;
    }
  }
}

.chevron {
  transition: transform 0.2s ease;
  
  &--rotated {
    transform: rotate(180deg);
  }
}

.flag {
  font-size: $text-base;
}

@media (min-width: $tablet-breakpoint) {
  .language {
    &-button {
      padding: $space-3 $space-4;
    }
    
    &-text {
      display: inline;
    }

    &-dropdown {
      right: 0;
    }
  }
}
</style>
