/**
 * Interfaz que representa los datos de un cliente devueltos por la API.
 */
export interface Cliente {
  /** Identificador único del cliente */
  id: string;
  /** Nombre completo del cliente */
  nombre: string;
  /** Correo electrónico */
  email: string;
  /** Teléfono de contacto */
  telefono: string;
  /** Dirección completa en formato texto */
  direccion: string;
  /** Estado actual (Activo, Inactivo, Suspendido) */
  status: string;
  /** Fecha de creación del registro */
  createdAt: string;
}

/**
 * DTO para crear un nuevo cliente.
 */
export interface CreateClienteRequest {
  /** Nombre completo */
  nombre: string;
  /** Correo electrónico */
  email: string;
  /** Teléfono de contacto */
  telefono: string;
  /** Calle y número */
  calle: string;
  /** Ciudad */
  ciudad: string;
  /** Estado o provincia */
  estado: string;
  /** Código postal */
  codigoPostal: string;
}

/**
 * DTO para actualizar un cliente existente.
 */
export interface UpdateClienteRequest {
  /** Nombre completo */
  nombre: string;
  /** Correo electrónico */
  email: string;
  /** Teléfono de contacto */
  telefono: string;
  /** Calle y número */
  calle: string;
  /** Ciudad */
  ciudad: string;
  /** Estado o provincia */
  estado: string;
  /** Código postal */
  codigoPostal: string;
}
