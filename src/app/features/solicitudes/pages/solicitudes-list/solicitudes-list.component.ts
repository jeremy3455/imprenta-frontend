import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SolicitudService, PagedResult } from '../../services/solicitud.service';
import { SolicitudResumen, SolicitudDetalle } from '../../models/solicitud.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './solicitudes-list.component.html',
  styleUrl: './solicitudes-list.component.scss',
})
export class SolicitudesListComponent implements OnInit {
  private readonly solicitudService = inject(SolicitudService);
  private readonly notificationService = inject(NotificationService);

  solicitudes: SolicitudResumen[] = [];
  loading = true;
  totalCount = 0;
  page = 1;
  pageSize = 10;
  filtroEstado = '';
  detalleSolicitud: SolicitudDetalle | null = null;
  showDetalle = false;
  convirtiendo = false;

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    this.loading = true;
    this.solicitudService
      .getAll(this.page, this.pageSize, this.filtroEstado || undefined)
      .subscribe({
        next: (data: PagedResult<SolicitudResumen>) => {
          this.solicitudes = data.items;
          this.totalCount = data.totalCount;
          this.loading = false;
        },
        error: () => {
          this.notificationService.showError('Error al cargar solicitudes.');
          this.loading = false;
        },
      });
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadSolicitudes();
  }

  onFilterChange(estado: string): void {
    this.filtroEstado = estado;
    this.page = 1;
    this.loadSolicitudes();
  }

  verDetalle(id: number): void {
    this.solicitudService.getById(id).subscribe({
      next: (data) => {
        this.detalleSolicitud = data;
        this.showDetalle = true;
      },
      error: () => this.notificationService.showError('Error al cargar detalle.'),
    });
  }

  convertirAPedido(id: number): void {
    this.convirtiendo = true;
    this.solicitudService.convertirAPedido(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Solicitud convertida a pedido correctamente.');
        this.cerrarDetalle();
        this.loadSolicitudes();
      },
      error: (err) => {
        this.notificationService.showError(err.error?.message || 'Error al convertir la solicitud.');
        this.convirtiendo = false;
      },
    });
  }

  cerrarDetalle(): void {
    this.showDetalle = false;
    this.detalleSolicitud = null;
  }

  totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  labelEstado(e: string): string {
    const map: Record<string, string> = { Pendiente: 'Pendiente', Aprobada: 'Aprobada', Rechazada: 'Rechazada' };
    return map[e] || e;
  }
}
