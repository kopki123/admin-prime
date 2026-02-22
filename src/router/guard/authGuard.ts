import type { RouteLocationNormalized, Router } from 'vue-router';
import { Access } from '../types';

export interface AuthGuardOptions {
  isLoggedIn: () => boolean;
  /** 沒登入時要去的登入頁（預設 'login'） */
  loginRouteName?: string;
  /** 已登入時的預設入口頁（預設 'dashboard'） */
  authenticatedRouteName?: string;
}

export function hasAccess(to: RouteLocationNormalized, options: AuthGuardOptions) {
  const access = (to.meta.access as Access) ?? Access.public;

  const {
    isLoggedIn,
    loginRouteName = 'login',
    authenticatedRouteName = 'dashboard',
  } = options;

  if (access === Access.auth && !isLoggedIn()) {
    return { name: loginRouteName, query: { redirect: to.fullPath } };
  }

  if (access === Access.guest && isLoggedIn()) {
    return { name: authenticatedRouteName };
  }

  return true;
}

export function setupAuthGuard(router: Router, options: AuthGuardOptions) {
  router.beforeEach((to) => hasAccess(to, options));
}
