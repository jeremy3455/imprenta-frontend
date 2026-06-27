import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard-page.component'
          ).then((m) => m.DashboardPageComponent),
        canActivate: [RoleGuard],
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import(
            './features/clientes/pages/clientes-list/clientes-list.component'
          ).then((m) => m.ClientesListComponent),
        canActivate: [RoleGuard],
      },
      {
        path: 'productos',
        loadComponent: () =>
          import(
            './features/productos/pages/productos-list/productos-list.component'
          ).then((m) => m.ProductosListComponent),
        canActivate: [RoleGuard],
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import(
            './features/pedidos/pages/pedidos-list/pedidos-list.component'
          ).then((m) => m.PedidosListComponent),
        canActivate: [RoleGuard],
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import(
            './features/solicitudes/pages/solicitudes-list/solicitudes-list.component'
          ).then((m) => m.SolicitudesListComponent),
        canActivate: [RoleGuard],
      },
      {
        path: 'mi-perfil',
        loadComponent: () =>
          import(
            './features/clientes/pages/mi-perfil/mi-perfil.component'
          ).then((m) => m.MiPerfilComponent),
      },
      {
        path: 'solicitar',
        loadComponent: () =>
          import(
            './features/solicitudes/pages/solicitar-producto/solicitar-producto.component'
          ).then((m) => m.SolicitarProductoComponent),
      },
      {
        path: 'mis-solicitudes',
        loadComponent: () =>
          import(
            './features/solicitudes/pages/mis-solicitudes/mis-solicitudes.component'
          ).then((m) => m.MisSolicitudesComponent),
      },
      {
        path: 'mis-pedidos',
        loadComponent: () =>
          import(
            './features/pedidos/pages/pedidos-list/pedidos-list.component'
          ).then((m) => m.PedidosListComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home-redirect.component').then(
            (m) => m.HomeRedirectComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/home/home-redirect.component').then(
        (m) => m.HomeRedirectComponent
      ),
  },
];
