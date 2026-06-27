import { Component, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './shared/components/notification-container/notification-container.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from './shared/services/confirm.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationContainerComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
})
export class App {
  private readonly confirmService = inject(ConfirmService);
  readonly confirmDialog = viewChild.required(ConfirmDialogComponent);

  ngAfterViewInit(): void {
    this.confirmService.register(this.confirmDialog());
  }
}
