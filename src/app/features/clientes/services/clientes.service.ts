import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Cliente, CreateClienteRequest, UpdateClienteRequest, SriConsultaResponse } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly endpoint = '/clientes';

  constructor(private readonly api: ApiService) {}

  getAll(estado?: boolean): Observable<Cliente[]> {
    const params = estado !== undefined ? `?estado=${estado}` : '';
    return this.api.get<Cliente[]>(`${this.endpoint}${params}`);
  }

  getById(id: number): Observable<Cliente> {
    return this.api.get<Cliente>(`${this.endpoint}/${id}`);
  }

  consultarSri(numero: string): Observable<SriConsultaResponse> {
    return this.api.get<SriConsultaResponse>(`${this.endpoint}/sri/${numero}`);
  }

  create(data: CreateClienteRequest): Observable<Cliente> {
    return this.api.post<Cliente>(this.endpoint, data);
  }

  update(id: number, data: UpdateClienteRequest): Observable<Cliente> {
    return this.api.put<Cliente>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
