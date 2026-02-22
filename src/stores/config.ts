import { i18n } from '@/plugins/i18n';

export type Locale = 'en-US' | 'zh-TW';
export type Theme = 'light' | 'dark' | 'system';

export const locales: Locale[] = ['en-US', 'zh-TW'];

const isClient = typeof window !== 'undefined';
const mediaQuery = isClient ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function getSystemPrefersDark(): boolean {
  if (!isClient) {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDarkClass(value: boolean) {
  if (!isClient || !document?.documentElement) return;

  document.documentElement.classList.toggle('my-app-dark', value);
}

export const useConfigStore = defineStore('config', () => {
  const theme = ref<Theme>('system');
  const isSidebarExpanded = ref(true);
  const currentLocale = ref<Locale>((isClient && (i18n.global.locale.value as Locale)) || 'zh-TW');

  const isDarkMode = computed(() => {
    if (theme.value === 'light') {
      return false;
    }

    if (theme.value === 'dark') {
      return true;
    }

    return getSystemPrefersDark();
  });

  const listener = (e: MediaQueryListEvent | MediaQueryList) => {
    const matches = 'matches' in e ? e.matches : !!mediaQuery?.matches;

    if (theme.value === 'system') {
      applyDarkClass(matches);
    }
  };

  if (mediaQuery) {
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', listener as EventListener);
    } else if ('addListener' in mediaQuery) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mediaQuery.addListener(listener);
    }

    const removeListener = () => {
      if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', listener as EventListener);
      } else if ('removeListener' in mediaQuery) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        mediaQuery.removeListener(listener);
      }

      window.removeEventListener('unload', removeListener);
    };

    window.addEventListener('unload', removeListener);
  }

  watch(theme, (value: Theme) => {
    if (value === 'light') {
      applyDarkClass(false);
      return;
    }

    if (value === 'dark') {
      applyDarkClass(true);
      return;
    }

    applyDarkClass(getSystemPrefersDark());
  }, { immediate: true });

  watch(currentLocale, (value: Locale) => {
    i18n.global.locale.value = value;
  }, { immediate: true });

  function handleSwitchTheme(value: Theme) {
    theme.value = value;
  }

  function toggleSidebar() {
    isSidebarExpanded.value = !isSidebarExpanded.value;
  }

  function setLocale(locale: Locale) {
    currentLocale.value = locale;
  }

  return {
    theme,
    isDarkMode,
    isSidebarExpanded,
    currentLocale,
    handleSwitchTheme,
    toggleSidebar,
    setLocale,
  };
}, {
  persist: true,
});
