import { usePrimeVue } from 'primevue/config';
import { i18n } from '@/plugins/i18n';
import { type Locale, useConfigStore } from '@/stores/config';
import { keysToCamel } from '@/utils';

export function usePrimeVueLocale() {
  const primevue = usePrimeVue();
  const configStore = useConfigStore();

  const fallbackLocale = i18n.global.fallbackLocale.value as Locale;
  const fallbackMessages = i18n.global.messages.value[fallbackLocale]?.primevue;

  watch(() => configStore.currentLocale, (newLocale) => {
    const messages = keysToCamel(i18n.global.messages.value[newLocale as Locale]?.primevue ?? fallbackMessages);

    Object.assign(primevue.config.locale!, messages);
  }, { immediate: true });
}
