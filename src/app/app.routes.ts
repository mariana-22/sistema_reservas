import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'recursos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/resources/listado/listado.component').then(m => m.ListadoComponent)
  },
  {
    path: 'recursos/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/resources/detalle/detalle.component').then(m => m.DetalleComponent)
  },
  {
    path: 'reservas',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/reservations/listado/listado.component').then(m => m.ListadoComponent)
  },
  {
    path: 'horarios',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/horarios/listado/listado.component').then(m => m.ListadoComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () => import('./features/admin/panel/panel.component').then(m => m.PanelComponent)
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/auth/perfil/perfil.component').then(m => m.PerfilComponent)
  }
];
