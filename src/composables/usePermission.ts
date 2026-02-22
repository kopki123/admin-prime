import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { RawPermission } from '@/constants/permissions';

export type MaybeArray<T> = T | T[];

function toArray<T>(value: MaybeArray<T>): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * 檢查目前權限是否包含 required 其中「任一個」。
 * - P：各 app 的 RawPermission 型別（extends string）
 * - superAdminKey：超級管理員的 key，預設為 '*'
 */
export function hasAnyPermission<P extends string>(
  currentPermissions: readonly P[],
  required: MaybeArray<P>,
  superAdminKey: P | '*' = '*',
): boolean {
  const requiredList = toArray(required);
  const permissionSet = new Set(currentPermissions);

  // 超級管理員：直接通過
  if (permissionSet.has(superAdminKey as P)) {
    return true;
  }

  return requiredList.some((key) => permissionSet.has(key));
}

/**
 * 檢查目前權限是否包含 required 「全部」。
 */
export function hasAllPermission<P extends string>(
  currentPermissions: readonly P[],
  required: MaybeArray<P>,
  superAdminKey: P | '*' = '*',
): boolean {
  const requiredList = toArray(required);
  const permissionSet = new Set(currentPermissions);

  if (permissionSet.has(superAdminKey as P)) {
    return true;
  }

  return requiredList.every((key) => permissionSet.has(key));
}

/**
 * 常用版本：
 * - 沒給 required → 視為不需要檢查，直接通過
 * - 有給 required → 預設用 hasAny 的邏輯
 */
export function hasPermissionHelper<P extends string>(
  currentPermissions: readonly P[],
  required?: MaybeArray<P>,
  superAdminKey: P | '*' = '*',
): boolean {
  if (!required) {
    return true;
  }

  return hasAnyPermission(currentPermissions, required, superAdminKey);
}


export function usePermission() {
  const authStore = useAuthStore();

  const permissions = computed<RawPermission[]>(() => authStore.permissions || []);

  function hasAny(required: MaybeArray<RawPermission>): boolean {
    return hasAnyPermission<RawPermission>(permissions.value, required);
  }

  function hasAll(required: MaybeArray<RawPermission>): boolean {
    return hasAllPermission<RawPermission>(permissions.value, required);
  }

  function hasPermission(required?: MaybeArray<RawPermission>): boolean {
    return hasPermissionHelper<RawPermission>(permissions.value, required);
  }

  return {
    permissions,
    hasAny,
    hasAll,
    hasPermission,
  };
}
