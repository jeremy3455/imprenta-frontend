import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  PedidoResumen,
  PedidoDetalle,
  CreatePedidoRequest,
  UpdatePedidoRequest,
  DatosSriRequest,
  AnularRequest,
  PedidoFiltro,
  PagedResult,
} from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly endpoint = '/pedidos';

  constructor(private readonly api: ApiService) {}

  getAll(filtro?: PedidoFiltro): Observable<PagedResult<PedidoResumen>> {
    const params: string[] = [];
    if (filtro) {
      if (filtro.estado) params.push(`estado=${encodeURIComponent(filtro.estado)}`);
      if (filtro.clienteId !== undefined) params.push(`clienteId=${filtro.clienteId}`);
      if (filtro.formaPago) params.push(`formaPago=${encodeURIComponent(filtro.formaPago)}`);
      if (filtro.fechaDesde) params.push(`fechaDesde=${encodeURIComponent(filtro.fechaDesde)}`);
      if (filtro.fechaHasta) params.push(`fechaHasta=${encodeURIComponent(filtro.fechaHasta)}`);
      if (filtro.search) params.push(`search=${encodeURIComponent(filtro.search)}`);
      if (filtro.page) params.push(`page=${filtro.page}`);
      if (filtro.pageSize) params.push(`pageSize=${filtro.pageSize}`);
    }
    const query = params.length > 0 ? '?' + params.join('&') : '';
    return this.api.get<PagedResult<PedidoResumen>>(`${this.endpoint}${query}`);
  }

  getById(id: number): Observable<PedidoDetalle> {
    return this.api.get<PedidoDetalle>(`${this.endpoint}/${id}`);
  }

  create(data: CreatePedidoRequest): Observable<PedidoDetalle> {
    return this.api.post<PedidoDetalle>(this.endpoint, data);
  }

  update(id: number, data: UpdatePedidoRequest): Observable<PedidoDetalle> {
    return this.api.put<PedidoDetalle>(`${this.endpoint}/${id}`, data);
  }

  aprobar(id: number): Observable<PedidoDetalle> {
    return this.api.patch<PedidoDetalle>(`${this.endpoint}/${id}/aprobar`, {});
  }

  iniciarProduccion(id: number): Observable<PedidoDetalle> {
    return this.api.patch<PedidoDetalle>(`${this.endpoint}/${id}/iniciar-produccion`, {});
  }

  marcarListoEntrega(id: number): Observable<PedidoDetalle> {
    return this.api.patch<PedidoDetalle>(`${this.endpoint}/${id}/listo-entrega`, {});
  }

  marcarEntregado(id: number): Observable<PedidoDetalle> {
    return this.api.patch<PedidoDetalle>(`${this.endpoint}/${id}/entregar`, {});
  }

  anular(id: number, data: AnularRequest): Observable<PedidoDetalle> {
    return this.api.patch<PedidoDetalle>(`${this.endpoint}/${id}/anular`, data);
  }

  completarDatosSri(pedidoId: number, detalleId: number, data: DatosSriRequest): Observable<PedidoDetalle> {
    return this.api.patch<PedidoDetalle>(`${this.endpoint}/${pedidoId}/detalle/${detalleId}/datos-sri`, data);
  }
}
