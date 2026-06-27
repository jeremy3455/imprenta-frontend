import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Categoria, Producto, CreateProductoRequest, UpdateProductoRequest, PagedResult } from '../models/producto.model';

export interface ProductoFiltro {
  categoriaId?: number;
  esDocumentoTributario?: boolean;
  estado?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly endpoint = '/productos';

  constructor(private readonly api: ApiService) {}

  getAll(filtro?: ProductoFiltro): Observable<PagedResult<Producto>> {
    const params: string[] = [];
    if (filtro) {
      if (filtro.categoriaId !== undefined) params.push(`categoriaId=${filtro.categoriaId}`);
      if (filtro.esDocumentoTributario !== undefined) params.push(`esDocumentoTributario=${filtro.esDocumentoTributario}`);
      if (filtro.estado !== undefined) params.push(`estado=${filtro.estado}`);
      if (filtro.search) params.push(`search=${encodeURIComponent(filtro.search)}`);
      if (filtro.page) params.push(`page=${filtro.page}`);
      if (filtro.pageSize) params.push(`pageSize=${filtro.pageSize}`);
    }
    const query = params.length > 0 ? '?' + params.join('&') : '';
    return this.api.get<PagedResult<Producto>>(`${this.endpoint}${query}`);
  }

  getById(id: number): Observable<Producto> {
    return this.api.get<Producto>(`${this.endpoint}/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.api.get<Categoria[]>(`${this.endpoint}/categorias`);
  }

  create(data: CreateProductoRequest): Observable<Producto> {
    return this.api.post<Producto>(this.endpoint, data);
  }

  update(id: number, data: UpdateProductoRequest): Observable<Producto> {
    return this.api.put<Producto>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
