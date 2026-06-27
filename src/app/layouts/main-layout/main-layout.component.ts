import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

/**
 * Layout principal de la aplicación para usuarios autenticados.
 * Incluye un sidebar de navegación lateral con enlaces a las
 * secciones principales y un área de contenido donde se renderizan
 * las páginas hijas mediante router-outlet.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  /** Elementos de navegación del sidebar */
  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/pedidos', label: 'Pedidos', icon: '📋' },
    { path: '/productos', label: 'Productos', icon: '🖨️' },
  ];

  /**
   * Cierra la sesión del usuario y redirige al login.
   */
  onLogout(): void {
    this.authService.logout();
    this.notificationService.showInfo('Sesión cerrada correctamente.');
    this.router.navigate(['/auth/login']);
  }
}
