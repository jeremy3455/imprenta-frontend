import { Component, inject, signal } from '@angular/core';
import {
  AppNotification,
  NotificationType,
} from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';

const TYPE_META: Record<
  NotificationType,
  { icon: string; defaultTitle: string; label: string }
> = {
  success: {
    icon: `<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd"/></svg>`,
    defaultTitle: 'Éxito',
    label: 'Éxito',
  },
  error: {
    icon: `<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd"/></svg>`,
    defaultTitle: 'Error',
    label: 'Error',
  },
  warning: {
    icon: `<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.166 2.63-1.515 2.63H3.72c-1.35 0-2.188-1.463-1.515-2.63L8.485 3.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/></svg>`,
    defaultTitle: 'Advertencia',
    label: 'Advertencia',
  },
  info: {
    icon: `<svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd"/></svg>`,
    defaultTitle: 'Información',
    label: 'Info',
  },
};

@Component({
  selector: 'app-notification-container',
  standalone: true,
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
})
export class NotificationContainerComponent {
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications;
  readonly dismissing = signal<Set<string>>(new Set());

  getMeta(type: NotificationType) {
    return TYPE_META[type];
  }

  getTitle(notification: AppNotification): string {
    return notification.title ?? TYPE_META[notification.type].defaultTitle;
  }

  dismiss(id: string): void {
    this.dismissing.update((s) => {
      s.add(id);
      return new Set(s);
    });
    setTimeout(() => {
      this.notificationService.dismiss(id);
      this.dismissing.update((s) => {
        s.delete(id);
        return new Set(s);
      });
    }, 250);
  }

  isDismissing(id: string): boolean {
    return this.dismissing().has(id);
  }
}
