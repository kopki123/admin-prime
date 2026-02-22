import type { PermissionKey } from '@/constants/permissions';

export const Access = {
  public: 'public', // 不管有沒有登入都可以進入頁面
  guest: 'guest',   // 只有「沒登入」才可以進入頁面，比如 login / register
  auth: 'auth',     // 需要登入才可以進頁面
} as const;

export type Access = (typeof Access)[keyof typeof Access];

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由存取權限（public/guest/auth） */
    access?: Access;
    /** 麵包屑顯示文字 */
    title?: string;
    /** 對應 i18n key，用於動態標題 */
    i18nKey?: string;
    /** 是否啟用 KeepAlive 緩存 */
    keepAlive?: boolean;
    /** 權限檢查 key，可接受單個或多個 */
    permissionKey?: PermissionKey | PermissionKey[];
  }
}
