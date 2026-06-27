import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { SolicitudCreate, SolicitudDetalle, SolicitudResumen, Notificacion } from '../models/solicitud.model';

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly api = inject(ApiService);

  getAll(page = 1, pageSize = 10, estado?: string): Observable<PagedResult<SolicitudResumen>> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (estado) params += `&estado=${estado}`;
    return this.api.get<PagedResult<SolicitudResumen>>(`/solicitudes${params}`);
  }

  getById(id: number): Observable<SolicitudDetalle> {
    return this.api.get<SolicitudDetalle>(`/solicitudes/${id}`);
  }

  create(dto: SolicitudCreate): Observable<SolicitudDetalle> {
    return this.api.post<SolicitudDetalle>('/solicitudes', dto);
  }

  getNotificaciones(): Observable<Notificacion[]> {
    return this.api.get<Notificacion[]>('/notificaciones');
  }

  countNoLeidas(): Observable<number> {
    return this.api.get<number>('/notificaciones/no-leidas');
  }

  marcarLeida(id: number): Observable<void> {
    return this.api.patch<void>(`/notificaciones/${id}/leer`, {});
  }

  marcarTodasLeidas(): Observable<void> {
    return this.api.patch<void>('/notificaciones/leer-todas', {});
  }
}
