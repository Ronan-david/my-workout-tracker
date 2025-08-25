import { createI18n } from "vue-i18n";
import en from '@/assets/i18n/locales/en.json'
import fr from '@/assets/i18n/locales/fr.json'

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})
