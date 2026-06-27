import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PedidosService } from '../../services/pedido.service';
import { PedidoDetalle, DetallePedido, EstadoPedido, DatosSriRequest } from '../../models/pedido.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './pedido-detalle.component.html',
  styleUrl: './pedido-detalle.component.scss',
})
export class PedidoDetalleComponent implements OnInit {
  private readonly pedidosService = inject(PedidosService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(ConfirmService);

  readonly pedidoId = input.required<number>();
  readonly cerrar = output<void>();

  readonly pedido = signal<PedidoDetalle | null>(null);
  readonly loading = signal(true);
  readonly editandoSri = signal<number | null>(null);

  sriNumeroAutorizacion = '';
  sriSeriePrincipal = '';
  sriSerieSecundaria = '';
  sriSecuencialDesde: number | null = null;
  sriSecuencialHasta: number | null = null;

  ngOnInit(): void {
    this.cargarPedido();
  }

  cargarPedido(): void {
    this.loading.set(true);
    this.pedidosService.getById(this.pedidoId()).subscribe({
      next: (data) => {
        this.pedido.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al cargar detalle del pedido.');
        this.loading.set(false);
      },
    });
  }

  abrirSri(detalle: DetallePedido): void {
    this.editandoSri.set(detalle.id);
    this.sriNumeroAutorizacion = detalle.numeroAutorizacionSri ?? '';
    this.sriSeriePrincipal = detalle.seriePrincipal ?? '';
    this.sriSerieSecundaria = detalle.serieSecundaria ?? '';
    this.sriSecuencialDesde = detalle.secuencialDesde ?? null;
    this.sriSecuencialHasta = detalle.secuencialHasta ?? null;
  }

  cerrarSri(): void {
    this.editandoSri.set(null);
  }

  guardarSri(detalleId: number): void {
    const data: DatosSriRequest = {
      numeroAutorizacionSri: this.sriNumeroAutorizacion.trim() || undefined,
      seriePrincipal: this.sriSeriePrincipal.trim() || undefined,
      serieSecundaria: this.sriSerieSecundaria.trim() || undefined,
      secuencialDesde: this.sriSecuencialDesde ?? undefined,
      secuencialHasta: this.sriSecuencialHasta ?? undefined,
    };

    this.pedidosService.completarDatosSri(this.pedidoId(), detalleId, data).subscribe({
      next: () => {
        this.notificationService.showSuccess('Datos SRI guardados correctamente.');
        this.cerrarSri();
        this.cargarPedido();
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error al guardar datos SRI.';
        this.notificationService.showError(msg);
      },
    });
  }

  async cambiarEstado(accion: string, label: string): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: label,
      message: `¿Estás seguro de ${label.toLowerCase()} este pedido?`,
      confirmLabel: label,
      cancelLabel: 'Cancelar',
    });
    if (!confirmed) return;

    const request = this.getEstadoRequest(accion);
    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Pedido ${label.toLowerCase()} correctamente.`);
        this.cargarPedido();
      },
      error: (err) => {
        const msg = err.error?.message || err.message || `Error al ${label.toLowerCase()} el pedido.`;
        if (err.status === 409) {
          this.notificationService.showWarning(msg);
        } else {
          this.notificationService.showError(msg);
        }
      },
    });
  }

  private getEstadoRequest(accion: string) {
    const id = this.pedidoId();
    switch (accion) {
      case 'aprobar': return this.pedidosService.aprobar(id);
      case 'iniciar-produccion': return this.pedidosService.iniciarProduccion(id);
      case 'listo-entrega': return this.pedidosService.marcarListoEntrega(id);
      case 'entregar': return this.pedidosService.marcarEntregado(id);
      default: throw new Error(`Acción desconocida: ${accion}`);
    }
  }

  async anularPedido(): Promise<void> {
    const motivo = await this.confirmService.prompt({
      title: 'Anular Pedido',
      message: `¿Estás seguro de anular este pedido?`,
      inputLabel: 'Motivo de anulación *',
      inputPlaceholder: 'Ingresa el motivo de la anulación',
      confirmLabel: 'Anular',
      cancelLabel: 'Cancelar',
      type: 'danger',
    });
    if (!motivo) return;

    this.pedidosService.anular(this.pedidoId(), { motivo }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Pedido anulado correctamente.');
        this.cargarPedido();
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
}
