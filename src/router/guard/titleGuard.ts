import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { i18n } from '@/plugins/i18n';

export function setupDocumentTitleGuard(router: Router) {
  router.afterEach(() => {
    const { t } = i18n.global;

    const systemTitle = t('system.title');
    const pageKey = router.currentRoute.value.meta?.i18nKey;
    const pageTitle = typeof pageKey === 'string' ? t(pageKey) : '';

    useTitle(pageTitle ? `${pageTitle} | ${systemTitle}` : systemTitle);
  });
}
