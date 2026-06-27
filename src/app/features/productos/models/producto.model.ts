export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precioUnitario: number;
  categoriaId: number;
  categoriaNombre: string;
  esDocumentoTributario: boolean;
  tipoContribuyenteAplicable?: string;
  estado: boolean;
  fechaRegistro: string;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string;
  precioUnitario: number;
  categoriaId: number;
  esDocumentoTributario: boolean;
  tipoContribuyenteAplicable?: string;
}

export type UpdateProductoRequest = CreateProductoRequest;

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
