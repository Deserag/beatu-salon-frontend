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
      },
      {
        path: ERouteConstans.USER_DEPARTMENT,
        loadComponent: () =>
          import(
            '../pages/user/user-department/user-department.component'
          ).then((m) => m.UserDepartmentComponent),
      },
    ],
  },
];

export const personalRoutes: Routes = [
  {
      path: ERouteConstans.USER_PAGE,
      loadComponent: () =>
        import('../pages/user/user-page/user-page.component').then(
          (m) => m.UserPageComponent
        ),
    },
]

export const statisticRoutes: Routes = [
  {
    path: ERouteConstans.ADMIN_STATISTICS,
    loadComponent: () =>
      import('../pages/statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      ),
  }
]

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
          import('../pages/user/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: ERouteConstans.OFFICE_PANEL,
        loadComponent: () =>
          import('../pages/office/office.component').then(
            (m) => m.OfficeComponent
          ),
      },
    ],
  },
];

export const clientRoutes: Routes = [
  {
    path: ERouteConstans.CLIENT_PANEL,
    loadComponent: () =>
      import('../pages/client/client.component').then((m) => m.ClientComponent),
      children: [
        {
          path: ERouteConstans.CLIENT_LIST,
          loadComponent: () =>
            import('../pages/client/client-list/client-list.component').then(
              (m) => m.ClientListComponent
            )
        },
        {
          path: ERouteConstans.CLIENT_ORDER,
          loadComponent: () =>
            import('../pages/client/clients-orders/clients-orders.component').then(
              (m) => m.ClientsOrdersComponent
            )
        },
        {
          path: ERouteConstans.CLIENT_PAGE,
          loadComponent: () =>
            import('../pages/client/client-page/client-page.component').then(
              (m) => m.ClientPageComponent
            )
        },
    ]
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
          loadComponent: () => import('../pages/services/list/list.component').then(
            (c) => c.ListComponent
          ),
        },
        {
          path: ERouteConstans.SERVICE_PAGE,
          loadComponent: () => import('../pages/services/service-page/service-page.component').then(
            (c) => c.ServicePageComponent
          )
        },
        {
          path: ERouteConstans.SERVICE_PRODUCT,
          loadComponent: () => import('../pages/services/product/product.component').then(
            (c) => c.ProductComponent
          )
        },
        {
          path: ERouteConstans.SERVICE_PRODUCT_SALE,
          loadComponent: () => import('../pages/services/product-sale/product-sale.component').then(
            (c) => c.ProductSaleComponent
          )
        },
        {
          path: ERouteConstans.SERVICE_USER,
          loadComponent: () => import('../pages/services/service-worker-assignment/service-worker-assignment.component').then(
            (c) => c.ServiceWorkerAssignmentComponent
          )
        },
      ]
  },
];

export const homePage: Routes = [
  {
    path: ERouteConstans.HOME_PAGE,
    loadComponent: () =>
      import('../pages/home-page/home-page.component').then(
        (c) => c.HomePageComponent
      )
  }
]

export const appRoutes: Routes = [
  {
    path: ERouteConstans.AUTH,
    loadChildren: () => authRoutes,
  },
  {
    path: ERouteConstans.MAIN,
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('../pages/work-page/work-page.component').then(
        (c) => c.WorkPageComponent
      ),
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
  { path: '', redirectTo: ERouteConstans.HOME_PAGE, pathMatch: 'full' },
  {
    path: ERouteConstans.HOME_PAGE,
    loadComponent: () =>
      import('../pages/home-page/home-page.component').then(
        (c) => c.HomePageComponent
      ),
  },
  ...userRoutes,
  ...adminRoutes,
  ...clientRoutes,
  ...officeRoutes,
  ...servicesRoutes,
  ...personalRoutes,
  ...statisticRoutes,
];
