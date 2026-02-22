export const RouteName = {
  Login: 'login',
  NotFound: 'not-found',
  Forbidden: 'forbidden',

  Dashboard: 'dashboard',
  UserManagement: 'user-management',
} as const;

export type RouteName = typeof RouteName[keyof typeof RouteName];
