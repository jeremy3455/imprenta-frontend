/**
 * Interfaz que representa las estadísticas resumidas del dashboard.
 */
export interface DashboardStats {
  /** Cantidad total de clientes activos */
  totalClientes: number;
  /** Cantidad total de pedidos */
  totalPedidos: number;
  /** Cantidad total de productos */
  totalProductos: number;
  /** Cantidad de pedidos pendientes */
  pendientes: number;
}
