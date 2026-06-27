import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { PedidosService } from '../../services/pedido.service';
import { PedidoResumen, PedidoFiltro, EstadoPedido } from '../../models/pedido.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { Cliente } from '../../../clientes/models/cliente.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PedidoFormComponent } from '../../components/pedido-form/pedido-form.component';
import { PedidoDetalleComponent } from '../../components/pedido-detalle/pedido-detalle.component';
import { PedidoSriComponent } from '../../components/pedido-sri/pedido-sri.component';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [FormsModule, DatePipe, EmptyStateComponent, PedidoFormComponent, PedidoDetalleComponent, PedidoSriComponent],
  templateUrl: './pedidos-list.component.html',
  styleUrl: './pedidos-list.component.scss',
})
export class PedidosListComponent implements OnInit {
  private readonly pedidosService = inject(PedidosService);
  private readonly clientesService = inject(ClientesService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(ConfirmService);

  readonly pedidos = signal<PedidoResumen[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly showDetalle = signal(false);
  readonly showSri = signal(false);
  readonly sriPedidoId = signal<number | null>(null);
  readonly detallePedidoId = signal<number | null>(null);

  search = '';
  filtroEstado = '';
  filtroClienteId = 0;
  filtroFormaPago = '';
  fechaDesde = '';
  fechaHasta = '';
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  readonly estados: { value: string; label: string }[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'Ingresado', label: 'Ingresado' },
    { value: 'Aprobado', label: 'Aprobado' },
    { value: 'EnProduccion', label: 'En Producción' },
    { value: 'ListoEntrega', label: 'Listo para Entrega' },
    { value: 'Entregado', label: 'Entregado' },
    { value: 'Anulado', label: 'Anulado' },
    { value: 'EnEsperaDatos', label: 'En Espera de Datos' },
  ];

  readonly formaPagoOptions = [
    { value: '', label: 'Todas' },
    { value: 'CONTADO', label: 'Contado' },
    { value: 'CREDITO', label: 'Crédito' },
  ];

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarPedidos();
  }

  cargarClientes(): void {
    this.clientesService.getAll(true).subscribe({
      next: (data) => this.clientes.set(data),
      error: () => this.clientes.set([]),
    });
  }

  cargarPedidos(): void {
    this.loading.set(true);
    const filtro: PedidoFiltro = { page: this.page, pageSize: this.pageSize };
    if (this.search.trim()) filtro.search = this.search.trim();
    if (this.filtroEstado) filtro.estado = this.filtroEstado;
    if (this.filtroClienteId > 0) filtro.clienteId = this.filtroClienteId;
    if (this.filtroFormaPago) filtro.formaPago = this.filtroFormaPago;
    if (this.fechaDesde) filtro.fechaDesde = this.fechaDesde;
    if (this.fechaHasta) filtro.fechaHasta = this.fechaHasta;

    this.pedidosService.getAll(filtro).pipe(timeout(15_000)).subscribe({
      next: (res) => {
        this.pedidos.set(res.items);
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al cargar pedidos.');
        this.loading.set(false);
      },
    });
  }

  filtrar(): void {
    this.page = 1;
    this.cargarPedidos();
  }

  cambiarPagina(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.cargarPedidos();
  }

  abrirFormulario(): void {
    this.showForm.set(true);
  }

  cerrarFormulario(): void {
    this.showForm.set(false);
    this.cargarPedidos();
  }

  verDetalle(id: number): void {
    this.detallePedidoId.set(id);
    this.showDetalle.set(true);
  }

  cerrarDetalle(): void {
    this.showDetalle.set(false);
    this.detallePedidoId.set(null);
    this.cargarPedidos();
  }

  abrirSriModal(id: number): void {
    this.sriPedidoId.set(id);
    this.showSri.set(true);
  }

  cerrarSriModal(): void {
    this.showSri.set(false);
    this.sriPedidoId.set(null);
    this.cargarPedidos();
  }

  async anularPedido(pedido: PedidoResumen): Promise<void> {
    const motivo = await this.confirmService.prompt({
      title: 'Anular Pedido',
      message: `¿Estás seguro de anular el pedido #${pedido.id} de ${pedido.razonSocialCliente}?`,
      inputLabel: 'Motivo de anulación *',
      inputPlaceholder: 'Ingresa el motivo de la anulación',
      confirmLabel: 'Anular',
      cancelLabel: 'Cancelar',
      type: 'danger',
    });
    if (!motivo) return;

    this.pedidosService.anular(pedido.id, { motivo }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Pedido anulado correctamente.');
        this.cargarPedidos();
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error al anular el pedido.';
        if (err.status === 409) {
          this.notificationService.showWarning(msg);
        } else {
          this.notificationService.showError(msg);
        }
      },
    });
  }

  labelEstado(estado: EstadoPedido): string {
    const map: Record<EstadoPedido, string> = {
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

  classEstado(estado: EstadoPedido): string {
    const map: Record<EstadoPedido, string> = {
      Ingresado: 'badge--ingresado',
      Aprobado: 'badge--aprobado',
      EnProduccion: 'badge--en-produccion',
      ListoEntrega: 'badge--listo-entrega',
      Entregado: 'badge--entregado',
      Anulado: 'badge--anulado',
      EnEsperaDatos: 'badge--espera-datos',
    };
    return map[estado] || '';
  }

  formatearMonto(monto: number): string {
    return `$${monto.toFixed(2)}`;
  }

  get paginas(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(1, this.page - 2);
    const fin = Math.min(this.totalPages, this.page + 2);
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }
}
