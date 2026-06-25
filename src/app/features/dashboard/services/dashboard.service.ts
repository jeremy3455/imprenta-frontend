import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../models/dashboard-stats.model';

/**
 * Servicio que provee los datos agregados para el panel de control.
 * Combina múltiples llamadas a la API para construir las estadísticas.
 * Los endpoints no implementados retornan 0 sin romper la carga.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private readonly api: ApiService) {}

  /**
   * Obtiene las estadísticas del dashboard consultando los diferentes endpoints.
   * @returns Observable con las estadísticas agregadas
   */
  getStats(): Observable<DashboardStats> {
    return forkJoin({
      totalClientes: this.api.get<unknown[]>('/clientes').pipe(
        map((data) => data.length),
        catchError(() => of(0)),
      ),
      totalPedidos: this.api.get<unknown[]>('/pedidos').pipe(
        map((data) => data.length),
        catchError(() => of(0)),
      ),
      totalProductos: this.api.get<unknown[]>('/productos').pipe(
        map((data) => data.length),
        catchError(() => of(0)),
      ),
      pendientes: this.api.get<unknown[]>('/pedidos?status=pendiente').pipe(
        map((data) => data.length),
        catchError(() => of(0)),
      ),
    });
  }
}
