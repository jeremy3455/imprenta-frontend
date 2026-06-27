import { Injectable, signal } from '@angular/core';
import {
  AppNotification,
  NotificationType,
  ShowNotificationOptions,
} from '../models/notification.model';

/** Duración por defecto (ms) según el tipo de notificación. */
const DEFAULT_DURATION: Record<NotificationType, number> = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

/**
 * Servicio global de notificaciones.
 * Gestiona una cola de toasts laterales con signals y auto-cierre.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** Cola activa de notificaciones visibles */
  readonly notifications = signal<AppNotification[]>([]);

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Muestra una notificación de éxito.
   * @param message - Texto del mensaje
   * @param options - Título o duración personalizada
   */
  showSuccess(message: string, options?: ShowNotificationOptions): void {
    this.show(message, 'success', options);
  }

  /**
   * Muestra una notificación de error.
   * @param message - Texto del mensaje
   * @param options - Título o duración personalizada
   */
  showError(message: string, options?: ShowNotificationOptions): void {
    this.show(message, 'error', options);
  }

  /**
   * Muestra una notificación de advertencia.
   * @param message - Texto del mensaje
   * @param options - Título o duración personalizada
   */
  showWarning(message: string, options?: ShowNotificationOptions): void {
    this.show(message, 'warning', options);
  }

  /**
   * Muestra una notificación informativa.
   * @param message - Texto del mensaje
   * @param options - Título o duración personalizada
   */
  showInfo(message: string, options?: ShowNotificationOptions): void {
    this.show(message, 'info', options);
  }

  /**
   * Agrega una notificación a la cola y programa su auto-cierre.
   * @param message - Texto del mensaje
   * @param type - Variante visual
   * @param options - Opciones adicionales
   */
  show(
    message: string,
    type: NotificationType = 'info',
    options?: ShowNotificationOptions
  ): void {
    const notification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      type,
      title: options?.title,
    };

    this.notifications.update((list) => [...list, notification]);

    const duration = options?.duration ?? DEFAULT_DURATION[type];
    if (duration > 0) {
      const timer = setTimeout(() => this.dismiss(notification.id), duration);
      this.timers.set(notification.id, timer);
    }
  }

  /**
   * Cierra una notificación por su id.
   * @param id - Identificador de la notificación
   */
  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
