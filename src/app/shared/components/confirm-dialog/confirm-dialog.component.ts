import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
  inputLabel?: string;
  inputPlaceholder?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly data = signal<ConfirmDialogData | null>(null);
  readonly visible = signal(false);
  readonly promptValue = signal('');
  readonly isPrompt = signal(false);
  private resolveBool: ((value: boolean) => void) | null = null;
  private resolveStr: ((value: string | null) => void) | null = null;

  confirm(data: ConfirmDialogData): Promise<boolean> {
    this.isPrompt.set(false);
    this.data.set(data);
    this.visible.set(true);
    return new Promise((resolve) => {
      this.resolveBool = resolve;
    });
  }

  prompt(data: ConfirmDialogData): Promise<string | null> {
    this.isPrompt.set(true);
    this.promptValue.set('');
    this.data.set(data);
    this.visible.set(true);
    return new Promise((resolve) => {
      this.resolveStr = resolve;
    });
  }

  onConfirm(): void {
    this.visible.set(false);
    if (this.isPrompt()) {
      this.resolveStr?.(this.promptValue().trim() || null);
      this.resolveStr = null;
    } else {
      this.resolveBool?.(true);
      this.resolveBool = null;
    }
  }

  onCancel(): void {
    this.visible.set(false);
    if (this.isPrompt()) {
      this.resolveStr?.(null);
      this.resolveStr = null;
    } else {
      this.resolveBool?.(false);
      this.resolveBool = null;
    }
  }
}
