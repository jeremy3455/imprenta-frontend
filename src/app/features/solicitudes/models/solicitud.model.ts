export interface SolicitudResumen {
  id: number;
  razonSocialCliente: string;
  clienteId: number;
  estado: string;
  observacion?: string;
  fechaSolicitud: string;
  cantidadItems: number;
}

export interface SolicitudDetalle {
  id: number;
  razonSocialCliente: string;
  numeroCedulaRuc: string;
  clienteId: number;
  estado: string;
  formaPago: string;
  pedidoId?: number;
  montoTotal?: number;
  observacion?: string;
  fechaSolicitud: string;
  items: SolicitudItem[];
}

export interface SolicitudItem {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  observacion?: string;
}

export interface SolicitudCreate {
  formaPago: string;
  observacion?: string;
  items: SolicitudCreateItem[];
}

export interface SolicitudCreateItem {
  productoId: number;
  cantidad: number;
  observacion?: string;
}

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  referenciaId?: number;
  leida: boolean;
  fecha: string;
}
