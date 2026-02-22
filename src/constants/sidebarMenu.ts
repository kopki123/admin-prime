import { PERMISSIONS, type PermissionKey } from '@/constants/permissions';
import { RouteName } from '@/router/routeNames';

export interface MenuItem {
  labelKey: string;
  icon?: string;
  to?: RouteName;
  url?: string;
  target?: string;
  items?: MenuItem[];
  permissionKey?: PermissionKey | PermissionKey[];
}

export const sidebarMenu: MenuItem[] = [
  {
    labelKey: 'nav.dashboard',
    icon: 'pi pi-chart-bar',
    to: RouteName.Dashboard,
  },
  {
    labelKey: 'nav.system_admin',
    icon: 'pi pi-cog',
    permissionKey: PERMISSIONS.USER_VIEW,
    items: [
      {
        labelKey: 'nav.user_section',
        icon: 'pi pi-users',
        permissionKey: PERMISSIONS.USER_VIEW,
        items: [
          {
            labelKey: 'nav.users',
            icon: 'pi pi-user-edit',
            to: RouteName.UserManagement,
            permissionKey: PERMISSIONS.USER_VIEW,
          },
        ],
      },
    ],
  },
];
