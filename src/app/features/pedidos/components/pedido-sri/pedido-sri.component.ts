import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedido.service';
import { PedidoDetalle, DetallePedido, DatosSriRequest } from '../../models/pedido.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-pedido-sri',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedido-sri.component.html',
  styleUrl: './pedido-sri.component.scss',
})
export class PedidoSriComponent implements OnInit {
  private readonly pedidosService = inject(PedidosService);
  private readonly notificationService = inject(NotificationService);

  readonly pedidoId = input.required<number>();
  readonly cerrar = output<void>();

  readonly pedido = signal<PedidoDetalle | null>(null);
  readonly loading = signal(true);
  readonly guardando = signal(false);

  sriData = new Map<number, {
    numeroAutorizacionSri: string;
    seriePrincipal: string;
    serieSecundaria: string;
    secuencialDesde: number | null;
    secuencialHasta: number | null;
  }>();

  ngOnInit(): void {
    this.cargarPedido();
  }

  cargarPedido(): void {
    this.loading.set(true);
    this.pedidosService.getById(this.pedidoId()).subscribe({
      next: (data) => {
        this.pedido.set(data);
        for (const det of data.detalles) {
          if (det.esDocumentoTributario) {
            this.sriData.set(det.id, {
              numeroAutorizacionSri: det.numeroAutorizacionSri ?? '',
              seriePrincipal: det.seriePrincipal ?? '',
              serieSecundaria: det.serieSecundaria ?? '',
              secuencialDesde: det.secuencialDesde ?? null,
              secuencialHasta: det.secuencialHasta ?? null,
            });
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al cargar pedido.');
        this.loading.set(false);
      },
    });
  }

  guardarTodo(): void {
    const detalles = (this.pedido()?.detalles ?? []).filter(d => d.esDocumentoTributario);
    if (detalles.length === 0) {
      this.notificationService.showWarning('No hay productos con documento tributario pendiente.');
      return;
    }

    this.guardando.set(true);
    this.procesarSiguiente(detalles, 0);
  }

  private procesarSiguiente(detalles: DetallePedido[], index: number): void {
    if (index >= detalles.length) {
      this.guardando.set(false);
      this.cerrar.emit();
      return;
    }

    const det = detalles[index];
    const data = this.sriData.get(det.id);
    if (!data) {
      this.procesarSiguiente(detalles, index + 1);
      return;
    }

    const dto: DatosSriRequest = {
      numeroAutorizacionSri: data.numeroAutorizacionSri.trim() || undefined,
      seriePrincipal: data.seriePrincipal.trim() || undefined,
      serieSecundaria: data.serieSecundaria.trim() || undefined,
      secuencialDesde: data.secuencialDesde ?? undefined,
      secuencialHasta: data.secuencialHasta ?? undefined,
    };

    this.pedidosService.completarDatosSri(this.pedidoId(), det.id, dto).subscribe({
      next: (pedidoActualizado) => {
        if (pedidoActualizado.estado === 'Aprobado') {
          this.notificationService.showSuccess('Todos los datos SRI completos. Pedido aprobado automáticamente.');
          this.guardando.set(false);
          this.cerrar.emit();
        } else {
          this.procesarSiguiente(detalles, index + 1);
        }
      },
      error: (err) => {
        this.guardando.set(false);
        const msg = err.error?.message || err.message || 'Error al guardar datos SRI.';
        this.notificationService.showError(msg);
      },
    });
  }
}
