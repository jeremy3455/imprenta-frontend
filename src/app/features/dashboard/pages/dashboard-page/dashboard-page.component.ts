import { Component } from '@angular/core';

/**
 * Página principal del panel de control.
 * Muestra tarjetas con estadísticas resumidas del negocio
 * y secciones de actividad reciente y próximos vencimientos.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  /** Lista de tarjetas de estadísticas con label, valor numérico e ícono */
  readonly stats = [
    { label: 'Clientes', value: 0, icon: '👥' },
    { label: 'Pedidos', value: 0, icon: '📋' },
    { label: 'Productos', value: 0, icon: '🖨️' },
    { label: 'Pendientes', value: 0, icon: '⏳' },
  ];
}
