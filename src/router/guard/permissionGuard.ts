import type { Router } from 'vue-router';
import type { PermissionKey } from '@/constants/permissions';
import { usePermission } from '@/composables/usePermission';
import { RouteName } from '@/router/routeNames';
import { Access } from '../types';

export function setupPermissionGuard(router: Router) {
  router.beforeEach((to) => {
    const access = (to.meta.access as Access) || Access.public;

    // 如果這頁 access 是 public / guest，就不檢查權限
    if (access !== Access.auth) {
      return true;
    }

    const permissionKey = to.meta.permissionKey as PermissionKey | PermissionKey[] | undefined;

    if (!permissionKey) {
      return true;
    }

    const { hasPermission } = usePermission();

    if (!hasPermission(permissionKey)) {
      return {
        name: RouteName.Forbidden,
        query: {
          from: to.fullPath,
        },
      };
    }

    return true;
  });
}
