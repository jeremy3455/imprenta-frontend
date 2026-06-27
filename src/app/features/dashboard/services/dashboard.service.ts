import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly api: ApiService) {}

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      totalClientes: this.api.get<unknown[]>('/clientes').pipe(
        map((data: any) => Array.isArray(data) ? data.length : 0),
        catchError(() => of(0)),
      ),
      totalPedidos: this.api.get<any>('/pedidos?pageSize=1').pipe(
        map((data) => data.totalCount ?? 0),
        catchError(() => of(0)),
      ),
      totalProductos: this.api.get<any>('/productos?pageSize=1').pipe(
        map((data) => data.totalCount ?? 0),
        catchError(() => of(0)),
      ),
      pendientes: this.api.get<any>('/pedidos?estado=Ingresado&pageSize=1').pipe(
        map((data) => data.totalCount ?? 0),
        catchError(() => of(0)),
      ),
      ultimosClientes: this.api.get<any>('/clientes').pipe(
        map((data) => (Array.isArray(data) ? data.slice(0, 5).map((c: any) => ({
          id: c.id,
          razonSocial: c.razonSocial,
          numeroCedulaRuc: c.numeroCedulaRuc,
        })) : [])),
        catchError(() => of([])),
      ),
      ultimosPedidos: this.api.get<any>('/pedidos?page=1&pageSize=5').pipe(
        map((data) => (data.items ?? []).map((p: any) => ({
          id: p.id,
          razonSocialCliente: p.razonSocialCliente,
          estado: p.estado,
          montoTotal: p.montoTotal,
        }))),
        catchError(() => of([])),
      ),
      ultimosProductos: this.api.get<any>('/productos?page=1&pageSize=5').pipe(
        map((data) => (data.items ?? []).map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          categoriaNombre: p.categoriaNombre,
        }))),
        catchError(() => of([])),
      ),
    });
  }
}
