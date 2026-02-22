export const PERMISSIONS = {
  // user
  USER_VIEW: 'sys:user:view',
  USER_CREATE: 'sys:user:create',
  USER_UPDATE: 'sys:user:update',
  USER_DELETE: 'sys:user:delete',
} as const;

export const SPECIAL_PERMISSIONS = {
  ALL: '*', // 超級管理員
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type SpecialPermission = (typeof SPECIAL_PERMISSIONS)[keyof typeof SPECIAL_PERMISSIONS];
export type RawPermission = string;
