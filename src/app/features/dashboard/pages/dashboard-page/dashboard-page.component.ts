import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  readonly stats = [
    { label: 'Clientes', value: 0, icon: '👥' },
    { label: 'Pedidos', value: 0, icon: '📋' },
    { label: 'Productos', value: 0, icon: '🖨️' },
    { label: 'Pendientes', value: 0, icon: '⏳' },
  ];
}
