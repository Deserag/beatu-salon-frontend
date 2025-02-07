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
        path: '',
        redirectTo: ERouteConstans.USER_LIST,
        pathMatch: 'full',
      },
      {
        path: ERouteConstans.USER_LIST,
        loadComponent: () =>
          import('../pages/user/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        children: [],
      },
      {
        path: ERouteConstans.USER_DEPARTMENT,
        loadComponent: () =>
          import(
            '../pages/user/user-department/user-department.component'
          ).then((m) => m.UserDepartmentComponent),
      },
      {
        path: ERouteConstans.USER_ROLE,
        loadComponent: () =>
          import('../pages/user/user-role/user-role.component').then(
            (m) => m.UserRoleComponent
          ),
      },
      {
        path: ERouteConstans.USER_PAGE + '/:id', 
        loadComponent: () =>
          import('../pages/user/user-page/user-page.component').then(
            (m) => m.UserPageComponent
          ),
      },
    ],
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
  },
];

export const clientRoutes: Routes = [
  {
    path: ERouteConstans.CLIENT_PANEL,
    loadComponent: () =>
      import('../pages/client/client.component').then((m) => m.ClientComponent),
  },
];

export const officeRoutes: Routes = [
  {
    path: ERouteConstans.OFFICE_PANEL,
    loadComponent: () =>
      import('../pages/office/office.component').then((m) => m.OfficeComponent),
    children: [
      {
        path: '',
        redirectTo: ERouteConstans.OFFICE_LIST,
        pathMatch: 'full',
      },
      {
        path: ERouteConstans.OFFICE_LIST,
        loadComponent: () =>
          import('../pages/office/office-page/office-page.component').then(
            (m) => m.OfficePageComponent
          ),
      },
      {
        path: ERouteConstans.CABINET_PANEL,
        loadComponent: () =>
          import(
            '../pages/office/office-cabinets/office-cabinets.component'
          ).then((m) => m.OfficeCabinetsComponent),
      },
    ],
  },
];

export const servicesRoutes: Routes = [
  {
    path: ERouteConstans.SERVICES_PANEL,
    loadComponent: () =>
      import('../pages/services/services.component').then(
        (c) => c.ServicesComponent
      ),
    children: [
      {
        path: '',
        redirectTo: ERouteConstans.SERVICE_LIST,
        pathMatch: 'full',
      },
      {
        path: ERouteConstans.SERVICE_LIST,
        loadComponent: () =>
          import('../pages/services/list/list.component').then(
            (c) => c.ListComponent
          ),
      },
      {
        path: ERouteConstans.SERVICE_PAGE,
        loadComponent: () =>
          import('../pages/services/service-page/service-page.component').then(
            (c) => c.ServicePageComponent
          ),
      },
      {
        path: ERouteConstans.SERVICE_PRODUCT,
        loadComponent: () =>
          import('../pages/services/product/product.component').then(
            (c) => c.ProductComponent
          ),
      },
      {
        path: ERouteConstans.SERVICE_PRODUCT_SALE,
        loadComponent: () =>
          import('../pages/services/product-sale/product-sale.component').then(
            (c) => c.ProductSaleComponent
          ),
      },
    ],
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
