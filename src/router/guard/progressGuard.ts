import 'nprogress/nprogress.css';

import type { Router } from 'vue-router';
import NProgress from 'nprogress';

NProgress.configure({
  showSpinner: false,
  minimum: 0.15,
  trickleSpeed: 200,
});

export function setupProgressGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    NProgress.start();
    next();
  });

  router.afterEach(() => NProgress.done());
}
