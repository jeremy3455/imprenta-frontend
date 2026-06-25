import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/pedidos', label: 'Pedidos', icon: '📋' },
    { path: '/productos', label: 'Productos', icon: '🖨️' },
  ];
}
