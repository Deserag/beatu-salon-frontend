import { Routes } from '@angular/router';
import { AuthGuard } from '@auth';
import { ERouteConstans } from '@routes';

export const routes: Routes = [];

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

export const mainRoutes: Routes = [
  {
    path: ERouteConstans.USER_PANEL,
    loadComponent: () =>
      import('../pages/user/user.component').then((m) => m.UserComponent),
  },
  {
    path: ERouteConstans.ADMIN_PANEL,
    loadComponent: () =>
      import('../pages/admin-panel/admin-panel.component').then(
        (m) => m.AdminPanelComponent
      ),
  },
  {
    path: ERouteConstans.CLIENT_PANEL,
    loadComponent: () =>
      import('../pages/client/client.component').then(
        (m) => m.ClientComponent
      ),
  },
  {
    path: ERouteConstans.OFFICE_PANEL,
    loadComponent: () =>
      import('../pages/office/office.component').then((m) => m.OfficeComponent),
  },
  {
    path: ERouteConstans.SERVICES_PANEL,
    loadComponent: () =>
      import('../pages/services/services.component').then(
        (c) => c.ServicesComponent
      ),
    canActivate: [AuthGuard],
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

export const appRoutes: Routes = [
  {
    path: ERouteConstans.MAIN,
    loadComponent: () =>
      import('../pages/work-page/work-page.component').then(
        (c) => c.WorkPageComponent
      ),
    canActivate: [AuthGuard],
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
