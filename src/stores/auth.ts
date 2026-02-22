import type { RawPermission } from '@/constants/permissions';
import {
  loginApi,
  logoutApi,
  checkLoginStatusApi,
  fetchMyPermissionsApi,
} from '@/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isSupervisor: false,
    permissions: [] as RawPermission[],
  }),
  actions: {
    clearAuthState() {
      this.isLoggedIn = false;
      this.isSupervisor = false;
      this.permissions = [];
    },

    async bootstrapSession(): Promise<boolean> {
      const checkResponse = await this.checkLoginStatus();

      if (!checkResponse.success) {
        return false;
      }

      const permissionResponse = await this.getMyPermissions();

      return permissionResponse.success;
    },

    async login(payload: Parameters<typeof loginApi>[0]): ReturnType<typeof loginApi> {
      const response = await loginApi(payload);

      if (response.success) {

        this.isLoggedIn = true;
        this.isSupervisor = false;
        this.permissions = [];
      }

      return response;
    },

    async logout(): ReturnType<typeof logoutApi> {
      const response = await logoutApi();

      this.clearAuthState();

      return response;
    },

    async checkLoginStatus(): ReturnType<typeof checkLoginStatusApi> {
      const response = await checkLoginStatusApi();

      if (response.success) {
        this.isLoggedIn = true;
      } else {
        this.clearAuthState();
      }

      return response;
    },

    async getMyPermissions(): ReturnType<typeof fetchMyPermissionsApi> {
      const response = await fetchMyPermissionsApi();

      if (response.success) {
        this.permissions = response.data;
        this.isSupervisor = response.data.includes('*');
      }

      return response;
    },
  },
});
