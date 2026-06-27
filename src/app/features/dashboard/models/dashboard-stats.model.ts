export interface DashboardCliente {
  id: number;
  razonSocial: string;
  numeroCedulaRuc: string;
}

export interface DashboardPedido {
  id: number;
  razonSocialCliente: string;
  estado: string;
  montoTotal: number;
}

export interface DashboardProducto {
  id: number;
  nombre: string;
  categoriaNombre: string;
}

export interface DashboardStats {
  totalClientes: number;
  totalPedidos: number;
  totalProductos: number;
  pendientes: number;
  ultimosClientes: DashboardCliente[];
  ultimosPedidos: DashboardPedido[];
  ultimosProductos: DashboardProducto[];
}
