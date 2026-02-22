import { useTitle } from '@vueuse/core';
import { router } from '@/router';
import { i18n } from '@/plugins/i18n';
import { useConfigStore } from '@/stores/config';

export function updateDocumentTitle() {
  const { t } = i18n.global;

  const systemTitle = t('system.title');
  const pageKey = router.currentRoute.value.meta?.i18nKey;
  const pageTitle = typeof pageKey === 'string' ? t(pageKey) : '';

  useTitle(pageTitle ? `${pageTitle} | ${systemTitle}` : systemTitle);
}

export function setupI18nTitleWatcher() {
  const configStore = useConfigStore();

  watch(() => configStore.currentLocale, updateDocumentTitle, { immediate: true });
}
