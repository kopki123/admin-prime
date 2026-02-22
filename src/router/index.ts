import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { setupBootstrapGuard } from './guard/bootstrapGuard';
import { setupDocumentTitleGuard } from './guard/titleGuard';
import { setupProgressGuard } from './guard/progressGuard';
import { setupAuthGuard } from './guard/authGuard';
import { setupPermissionGuard } from './guard/permissionGuard';
import { RouteName } from './routeNames';
import { Access } from './types';
import { PERMISSIONS } from '@/constants/permissions';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }

    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: RouteName.Dashboard,
          component: () => import('../views/dashboard/index.vue'),
          meta: {
            access: Access.auth,
            i18nKey: 'route.dashboard',
            keepAlive: true,
          },
        },
        {
          path: 'users',
          name: RouteName.UserManagement,
          component: () => import('../views/user-list/index.vue'),
          meta: {
            access: Access.auth,
            i18nKey: 'route.users',
            keepAlive: true,
            permissionKey: PERMISSIONS.USER_VIEW,
          },
        },
      ],
    },
    {
      path: '/error',
      component: () => import('@/layouts/ErrorLayout.vue'),
      meta: {
        access: Access.public,
      },
      children: [
        {
          path: '',
          redirect: '/404',
        },
        {
          path: '403',
          alias: '/403',
          name: RouteName.Forbidden,
          component: () => import('@/views/errors/Error403.vue'),
          meta: {
            i18nKey: 'route.forbidden',
          },
        },
        {
          path: '404',
          alias: '/404',
          name: RouteName.NotFound,
          component: () => import('@/views/errors/Error404.vue'),
          meta: {
            i18nKey: 'route.not_found',
          },
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: {
        access: Access.guest,
      },
      children: [
        {
          path: '',
          name: RouteName.Login,
          component: () => import('../views/login/index.vue'),
          meta: {
            i18nKey: 'route.login',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: RouteName.NotFound,
      },
    },
  ]
});

setupBootstrapGuard(router, {
  bootstrap: async () => {
    const authStore = useAuthStore();

    await authStore.bootstrapSession();
  },
});

setupAuthGuard(router, { isLoggedIn: () => {
  const authStore = useAuthStore();

  return authStore.isLoggedIn;
}});

setupPermissionGuard(router);
setupDocumentTitleGuard(router);
setupProgressGuard(router);
