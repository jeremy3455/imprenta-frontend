import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../models/cliente.model';

/**
 * Servicio que maneja las operaciones CRUD de clientes contra la API.
 */
@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly endpoint = '/clientes';

  constructor(private readonly api: ApiService) {}

  /**
   * Obtiene todos los clientes activos.
   * @returns Observable con la lista de clientes
   */
  getAll(): Observable<Cliente[]> {
    return this.api.get<Cliente[]>(this.endpoint);
  }

  /**
   * Obtiene un cliente por su Id.
   * @param id - Identificador único del cliente
   * @returns Observable con el cliente encontrado
   */
  getById(id: string): Observable<Cliente> {
    return this.api.get<Cliente>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo cliente.
   * @param data - Datos del cliente a crear
   * @returns Observable con el cliente creado
   */
  create(data: CreateClienteRequest): Observable<Cliente> {
    return this.api.post<Cliente>(this.endpoint, data);
  }

  /**
   * Actualiza un cliente existente.
   * @param id - Id del cliente a actualizar
   * @param data - Nuevos datos del cliente
   * @returns Observable con el cliente actualizado
   */
  update(id: string, data: UpdateClienteRequest): Observable<Cliente> {
    return this.api.put<Cliente>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Elimina (soft delete) un cliente por su Id.
   * @param id - Id del cliente a eliminar
   * @returns Observable vacío
   */
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
