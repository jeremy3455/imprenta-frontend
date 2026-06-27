/**
 * Interfaz que representa los datos de un cliente devueltos por la API.
 * Corresponde a la tabla Clientes de la base de datos SQL.
 */
export interface Cliente {
  /** Identificador único del cliente (IDENTITY) */
  id: number;
  /** RUC del cliente (13 dígitos) */
  ruc: string;
  /** Razón social */
  razonSocial: string;
  /** Dirección física */
  direccion?: string;
  /** Teléfono de contacto */
  telefono?: string;
  /** Correo electrónico */
  email?: string;
  /** Indica si el cliente está activo */
  activo: boolean;
}

/**
 * DTO para crear un nuevo cliente.
 */
export interface CreateClienteRequest {
  /** RUC del cliente (13 dígitos) */
  ruc: string;
  /** Razón social */
  razonSocial: string;
  /** Dirección física */
  direccion?: string;
  /** Teléfono de contacto */
  telefono?: string;
  /** Correo electrónico */
  email?: string;
}

/**
 * DTO para actualizar un cliente existente.
 */
export interface UpdateClienteRequest {
  /** RUC del cliente (13 dígitos) */
  ruc: string;
  /** Razón social */
  razonSocial: string;
  /** Dirección física */
  direccion?: string;
  /** Teléfono de contacto */
  telefono?: string;
  /** Correo electrónico */
  email?: string;
}
