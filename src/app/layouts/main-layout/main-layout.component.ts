import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

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
  /** Elementos de navegación del sidebar */
  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/pedidos', label: 'Pedidos', icon: '📋' },
    { path: '/productos', label: 'Productos', icon: '🖨️' },
  ];
}
