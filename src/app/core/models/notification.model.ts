/** Tipos de notificación soportados por el sistema global. */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** Representa una notificación visible en el panel lateral. */
export interface AppNotification {
  /** Identificador único para dismiss y animaciones */
  id: string;
  /** Mensaje principal mostrado al usuario */
  message: string;
  /** Título opcional (por defecto según el tipo) */
  title?: string;
  /** Variante visual de la notificación */
  type: NotificationType;
}

/** Opciones al mostrar una notificación. */
export interface ShowNotificationOptions {
  /** Título personalizado */
  title?: string;
  /** Duración en ms antes de auto-cerrar (0 = no auto-cerrar) */
  duration?: number;
}
