import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Página principal del panel de control.
 * Muestra tarjetas con estadísticas resumidas del negocio
 * obtenidas desde la API del backend.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notificationService = inject(NotificationService);

  /** Indica si los datos están cargando */
  loading = true;

  /** Lista de tarjetas de estadísticas con label, valor numérico e ícono */
  stats = [
    { label: 'Clientes', value: 0, icon: '👥' },
    { label: 'Pedidos', value: 0, icon: '📋' },
    { label: 'Productos', value: 0, icon: '🖨️' },
    { label: 'Pendientes', value: 0, icon: '⏳' },
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  /**
   * Carga las estadísticas desde el servicio del dashboard.
   * Actualiza el arreglo de stats con los valores reales.
   */
  private loadStats(): void {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = [
          { label: 'Clientes', value: data.totalClientes, icon: '👥' },
          { label: 'Pedidos', value: data.totalPedidos, icon: '📋' },
          { label: 'Productos', value: data.totalProductos, icon: '🖨️' },
          { label: 'Pendientes', value: data.pendientes, icon: '⏳' },
        ];
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError(
          'Error al cargar las estadísticas. Intenta nuevamente.'
        );
        this.loading = false;
      },
    });
  }
}
