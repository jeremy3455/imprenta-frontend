import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';

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

  /** Indica si los datos están cargando */
  loading = true;

  /** Indica si ocurrió un error al cargar */
  hasError = false;

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
    this.hasError = false;

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
        this.hasError = true;
        this.loading = false;
      },
    });
  }
}
