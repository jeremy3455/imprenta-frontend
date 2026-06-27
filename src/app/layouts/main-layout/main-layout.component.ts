import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly api = inject(ApiService);

  readonly isAdmin = this.authService.isAdmin();
  readonly isCliente = this.authService.isCliente();
  readonly nombreUsuario = this.authService.getUserData()?.nombre ?? '';
  notificacionesNoLeidas = 0;

  readonly adminNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '\u{1F4CA}' },
    { path: '/clientes', label: 'Clientes', icon: '\u{1F465}' },
    { path: '/pedidos', label: 'Pedidos', icon: '\u{1F4CB}' },
    { path: '/productos', label: 'Productos', icon: '\u{1F5A8}\u{FE0F}' },
    { path: '/solicitudes', label: 'Solicitudes', icon: '\u{1F4E9}' },
  ];

  readonly clienteNavItems = [
    { path: '/mi-perfil', label: 'Mi Perfil', icon: '\u{1F464}' },
    { path: '/solicitar', label: 'Solicitar Producto', icon: '\u{1F4E8}' },
    { path: '/mis-solicitudes', label: 'Mis Solicitudes', icon: '\u{1F4CB}' },
    { path: '/mis-pedidos', label: 'Mis Pedidos', icon: '\u{1F4E6}' },
  ];

  get navItems() {
    return this.isAdmin ? this.adminNavItems : this.clienteNavItems;
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.cargarNotificaciones();
    }
  }

  private cargarNotificaciones(): void {
    this.api.get<number>('/notificaciones/no-leidas').subscribe({
      next: (count) => (this.notificacionesNoLeidas = count),
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.notificationService.showInfo('Sesi\u00F3n cerrada correctamente.');
    this.router.navigate(['/auth/login']);
  }
}
