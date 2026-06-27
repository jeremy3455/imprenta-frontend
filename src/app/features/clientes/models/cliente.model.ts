export interface Cliente {
  id: number;
  numeroCedulaRuc: string;
  razonSocial: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  tipoContribuyente?: string;
  estado: boolean;
  fechaRegistro: string;
}

export interface CreateClienteRequest {
  numeroCedulaRuc: string;
  razonSocial: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  tipoContribuyente?: string;
}

export interface UpdateClienteRequest {
  numeroCedulaRuc: string;
  razonSocial: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  tipoContribuyente?: string;
}

export interface SriConsultaResponse {
  numeroCedulaRuc: string;
  razonSocial: string;
  direccion?: string;
  tipoContribuyente?: string;
  encontrado: boolean;
}
