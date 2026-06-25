import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Servicio base para realizar peticiones HTTP hacia la API del backend.
 * Centraliza los métodos GET, POST, PUT y DELETE usando HttpClient de Angular.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  /**
   * Ejecuta una petición GET hacia el endpoint indicado.
   * @param endpoint - Ruta relativa del recurso (ej. "/clientes")
   * @returns Observable con la respuesta tipada como T
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Ejecuta una petición POST para crear un recurso.
   * @param endpoint - Ruta relativa del recurso
   * @param data - Cuerpo de la petición con los datos a crear
   * @returns Observable con la respuesta tipada como T
   */
  post<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Ejecuta una petición PUT para actualizar un recurso existente.
   * @param endpoint - Ruta relativa del recurso
   * @param data - Cuerpo de la petición con los datos actualizados
   * @returns Observable con la respuesta tipada como T
   */
  put<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Ejecuta una petición DELETE para eliminar un recurso.
   * @param endpoint - Ruta relativa del recurso a eliminar
   * @returns Observable con la respuesta tipada como T
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
