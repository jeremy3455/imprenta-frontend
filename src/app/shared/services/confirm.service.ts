import { Injectable, viewChild } from '@angular/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private dialog: ConfirmDialogComponent | null = null;

  register(dialog: ConfirmDialogComponent): void {
    this.dialog = dialog;
  }

  confirm(data: ConfirmDialogData): Promise<boolean> {
    if (!this.dialog) {
      return Promise.resolve(window.confirm(data.message));
    }
    return this.dialog.confirm(data);
  }

  prompt(data: ConfirmDialogData): Promise<string | null> {
    if (!this.dialog) {
      return Promise.resolve(window.prompt(data.inputLabel));
    }
    return this.dialog.prompt(data);
  }
}
