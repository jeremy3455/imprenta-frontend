import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats, DashboardCliente, DashboardPedido, DashboardProducto } from '../../models/dashboard-stats.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notificationService = inject(NotificationService);

  loading = true;

  stats = [
    { label: 'Clientes', value: 0, icon: '👥', link: '/clientes' },
    { label: 'Pedidos', value: 0, icon: '📋', link: '/pedidos' },
    { label: 'Productos', value: 0, icon: '🖨️', link: '/productos' },
    { label: 'Pendientes', value: 0, icon: '⏳', link: '/pedidos' },
  ];

  clientes: DashboardCliente[] = [];
  pedidos: DashboardPedido[] = [];
  productos: DashboardProducto[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = [
          { label: 'Clientes', value: data.totalClientes, icon: '👥', link: '/clientes' },
          { label: 'Pedidos', value: data.totalPedidos, icon: '📋', link: '/pedidos' },
          { label: 'Productos', value: data.totalProductos, icon: '🖨️', link: '/productos' },
          { label: 'Pendientes', value: data.pendientes, icon: '⏳', link: '/pedidos' },
        ];
        this.clientes = data.ultimosClientes;
        this.pedidos = data.ultimosPedidos;
        this.productos = data.ultimosProductos;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar las estadísticas.');
        this.loading = false;
      },
    });
  }

  labelEstado(estado: string): string {
    const map: Record<string, string> = {
      Ingresado: 'Ingresado',
      Aprobado: 'Aprobado',
      EnProduccion: 'En Producción',
      ListoEntrega: 'Listo para Entrega',
      Entregado: 'Entregado',
      Anulado: 'Anulado',
      EnEsperaDatos: 'Espera Datos',
    };
    return map[estado] || estado;
  }

  formatearMonto(monto: number): string {
    return `$${monto.toFixed(2)}`;
  }
}
