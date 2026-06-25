import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

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
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import(
            './features/clientes/pages/clientes-list/clientes-list.component'
          ).then((m) => m.ClientesListComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
