export type EstadoPedido = 'Ingresado' | 'Aprobado' | 'EnProduccion' | 'ListoEntrega' | 'Entregado' | 'Anulado' | 'EnEsperaDatos';

export type FormaPago = 'CONTADO' | 'CREDITO';

export interface PedidoResumen {
  id: number;
  clienteId: number;
  razonSocialCliente: string;
  estado: EstadoPedido;
  formaPago: FormaPago;
  montoTotal: number;
  montoPendiente: number;
  fechaRegistro: string;
  cantidadItems: number;
}

export interface DetallePedido {
  id: number;
  productoId: number;
  nombreProducto: string;
  esDocumentoTributario: boolean;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  numeroAutorizacionSri?: string;
  seriePrincipal?: string;
  serieSecundaria?: string;
  secuencialDesde?: number;
  secuencialHasta?: number;
  datosCompletos: boolean;
}

export interface PedidoDetalle {
  id: number;
  clienteId: number;
  razonSocialCliente: string;
  numeroCedulaRuc: string;
  estado: EstadoPedido;
  formaPago: FormaPago;
  montoTotal: number;
  montoAnticipo: number;
  montoPendiente: number;
  fechaVencimientoCredito?: string;
  observaciones?: string;
  fechaRegistro: string;
  fechaAprobacion?: string;
  fechaInicioProduccion?: string;
  fechaListoEntrega?: string;
  fechaEntrega?: string;
  fechaAnulacion?: string;
  motivoAnulacion?: string;
  detalles: DetallePedido[];
}

export interface CreatePedidoRequest {
  clienteId: number;
  formaPago: FormaPago;
  montoAnticipo: number;
  fechaVencimientoCredito?: string;
  observaciones?: string;
  items: CreateDetallePedidoRequest[];
}

export interface CreateDetallePedidoRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  numeroAutorizacionSri?: string;
  seriePrincipal?: string;
  serieSecundaria?: string;
  secuencialDesde?: number;
  secuencialHasta?: number;
}

export type UpdatePedidoRequest = CreatePedidoRequest;

export interface DatosSriRequest {
  numeroAutorizacionSri?: string;
  seriePrincipal?: string;
  serieSecundaria?: string;
  secuencialDesde?: number;
  secuencialHasta?: number;
}

export interface AnularRequest {
  motivo: string;
}

export interface PedidoFiltro {
  estado?: string;
  clienteId?: number;
  formaPago?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
