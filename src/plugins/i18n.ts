import { createI18n } from 'vue-i18n';
import zhTW from '@/locales/zh-TW.json';
import enUS from '@/locales/en-US.json';

const DEFAULT_LOCALE = 'en-US';
const FALLBACK_LOCALE = 'en-US';

const messages = {
  'zh-TW': zhTW,
  'en-US': enUS,
};

export const SUPPORTED_LOCALES = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en-US', label: 'English' },
];

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]['value'];

export const i18n = createI18n({
  globalInjection: true,
  allowComposition: true,
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  messages,
});
