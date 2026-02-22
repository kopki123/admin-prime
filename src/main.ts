import '@/assets/styles/main.css';
import 'primeicons/primeicons.css';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import FocusTrap from 'primevue/focustrap';
import KeyFilter from 'primevue/keyfilter';
import Tooltip from 'primevue/tooltip';

import { router } from '@/router';
import { i18n } from '@/plugins/i18n';
import { setupI18nTitleWatcher } from '@/plugins/i18nTitle';
import { primeVuePreset } from '@/themes/primevue';
import { vLoading } from '@/directives/loading';
import { vPermission } from '@/directives/permission';
import { usePrimeVueLocale } from '@/composables/usePrimeVueLocale';
import App from '@/App.vue';

import { version } from '../package.json';

async function enableMocking() {
  if (import.meta.env.VITE_MOCK !== 'true') return;

  const { worker } = await import('./mocks/browser');
  await worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    onUnhandledRequest: 'bypass',
  });
  console.log('[MSW] Mocking enabled.');
}


async function main() {
  const start = performance.now();

  await enableMocking();

  const app = createApp(App);
  const pinia = createPinia();

  pinia.use(piniaPluginPersistedstate);

  app.use(pinia);
  app.use(router);
  app.use(i18n);
  app.use(PrimeVue, {
    theme: {
      preset: primeVuePreset,
      options: {
        darkModeSelector: '.my-app-dark',
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue',
        },
      },
    },
  });
  app.runWithContext(() => {
    usePrimeVueLocale();
  });
  app.use(ConfirmationService);
  app.use(DialogService);
  app.use(ToastService);

  app.directive('focustrap', FocusTrap);
  app.directive('keyfilter', KeyFilter);
  app.directive('tooltip', Tooltip);
  app.directive('loading', vLoading);
  app.directive('permission', vPermission);

  setupI18nTitleWatcher();

  await router.isReady();
  app.mount('#app');

  const end = performance.now();
  const appVersion = `v${version}`;

  console.info(`App version: ${appVersion}`);
  console.info(`App mount time: ${(end - start).toFixed(2)}ms`);
}

main();
