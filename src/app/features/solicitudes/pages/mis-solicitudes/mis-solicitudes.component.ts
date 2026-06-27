import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SolicitudService, PagedResult } from '../../services/solicitud.service';
import { SolicitudResumen, SolicitudDetalle } from '../../models/solicitud.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss',
})
export class MisSolicitudesComponent implements OnInit {
  private readonly solicitudService = inject(SolicitudService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  solicitudes: SolicitudResumen[] = [];
  loading = true;
  detalleSolicitud: SolicitudDetalle | null = null;
  showDetalle = false;

  ngOnInit(): void {
    if (!this.authService.isCliente()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
    this.loading = true;
    this.solicitudService.getAll(1, 50).subscribe({
      next: (data: PagedResult<SolicitudResumen>) => {
        this.solicitudes = data.items;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar solicitudes.');
        this.loading = false;
      },
    });
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

  cerrarDetalle(): void {
    this.showDetalle = false;
    this.detalleSolicitud = null;
  }

  labelEstado(e: string): string {
    const map: Record<string, string> = { Pendiente: 'Pendiente', Aprobada: 'Aprobada', Rechazada: 'Rechazada' };
    return map[e] || e;
  }
}
