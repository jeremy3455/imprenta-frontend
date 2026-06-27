import { Component, inject } from '@angular/core';
import {
  AppNotification,
  NotificationType,
} from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';

/** Metadatos visuales por tipo de notificación. */
const TYPE_META: Record<
  NotificationType,
  { icon: string; defaultTitle: string }
> = {
  success: { icon: '✓', defaultTitle: 'Éxito' },
  error: { icon: '✕', defaultTitle: 'Error' },
  warning: { icon: '⚠', defaultTitle: 'Advertencia' },
  info: { icon: 'ℹ', defaultTitle: 'Información' },
};

/**
 * Contenedor fijo en el lateral derecho que muestra la cola de notificaciones.
 * Se monta una sola vez en el root de la aplicación.
 */
@Component({
  selector: 'app-notification-container',
  standalone: true,
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
})
export class NotificationContainerComponent {
  private readonly notificationService = inject(NotificationService);

  /** Lista reactiva de notificaciones activas */
  readonly notifications = this.notificationService.notifications;

  /**
   * Obtiene el ícono según el tipo de notificación.
   * @param type - Tipo de la notificación
   */
  getIcon(type: NotificationType): string {
    return TYPE_META[type].icon;
  }

  /**
   * Obtiene el título a mostrar (personalizado o por defecto).
   * @param notification - Notificación actual
   */
  getTitle(notification: AppNotification): string {
    return notification.title ?? TYPE_META[notification.type].defaultTitle;
  }

  /**
   * Cierra una notificación manualmente.
   * @param id - Id de la notificación
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
