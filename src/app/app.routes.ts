import { Routes } from '@angular/router';
import { AuthGuard } from '@auth';
import { ERouteConstans } from '@routes';

export const routes: Routes = [];

export const userRoutes: Routes = [
  {
    path: ERouteConstans.USER_PANEL,
    loadComponent: () =>
      import('../pages/user/user.component').then((m) => m.UserComponent),
    children: [
      {
        path: ERouteConstans.USER_LIST,
        loadComponent: () =>
          import('../pages/user/user-list/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: ERouteConstans.USER_DEPARTMENT,
        loadComponent: () =>
          import('../pages/user/user-department/user-department.component').then((m) => m.UserDepartmentComponent),
      },
      {
        path: ERouteConstans.USER_ROLE,
        loadComponent: () =>
          import('../pages/user/user-role/user-role.component').then((m) => m.UserRoleComponent),
      }
    ]
  },
];

export const authRoutes: Routes = [
  {
    path: ERouteConstans.LOGIN,
    loadComponent: () =>
      import('../pages/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  { path: ERouteConstans.WILDCARD, redirectTo: ERouteConstans.LOGIN },
];

export const adminRoutes: Routes = [
  {
    path: ERouteConstans.ADMIN_PANEL,
    loadComponent: () =>
      import('../pages/admin-panel/admin-panel.component').then(
        (m) => m.AdminPanelComponent
      ),
    children: [
      {
        path: ERouteConstans.USER_LIST,
        loadComponent: () =>
          import('../pages/user/user-list/user-list.component').then((m) => m.UserListComponent),
      },
    ]
  },
];

export const clientRoutes: Routes = [
  {
    path: ERouteConstans.CLIENT_PANEL,
    loadComponent: () =>
      import('../pages/client/client.component').then(
        (m) => m.ClientComponent
      ),
  },
];

export const officeRoutes: Routes = [
  {
    path: ERouteConstans.OFFICE_PANEL,
    loadComponent: () =>
      import('../pages/office/office.component').then((m) => m.OfficeComponent),
  },
];

export const servicesRoutes: Routes = [
  {
    path: ERouteConstans.SERVICES_PANEL,
    loadComponent: () =>
      import('../pages/services/services.component').then(
        (c) => c.ServicesComponent
      ),
    // canActivate: [AuthGuard],
    loadChildren: () => servicesRoutes,
  },
];

export const appRoutes: Routes = [
  {
    path: ERouteConstans.MAIN,
    loadComponent: () =>
      import('../pages/work-page/work-page.component').then(
        (c) => c.WorkPageComponent
      ),
    // canActivate: [AuthGuard],
    loadChildren: () => mainRoutes,
  },
  {
    path: ERouteConstans.AUTH,
    loadChildren: () => authRoutes,
  },
  {
    path: '**',
    redirectTo: ERouteConstans.MAIN,
  },
];

export const mainRoutes: Routes = [
  ...userRoutes,
  ...adminRoutes,
  ...clientRoutes,
  ...officeRoutes,
  ...servicesRoutes,
  {
    path: ERouteConstans.AUTH,
    loadChildren: () => authRoutes,
  },
  {
    path: '**',
    redirectTo: ERouteConstans.MAIN,
  },
];
