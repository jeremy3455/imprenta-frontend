import {
  Component,
  ElementRef,
  forwardRef,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Input de 6 dígitos para código OTP.
 * Soporta navegación con teclado, pegado y validación numérica.
 */
@Component({
  selector: 'app-otp-input',
  standalone: true,
  template: `
    <div class="otp-input" role="group" aria-label="Código de verificación de 6 dígitos">
      @for (digit of digits; track $index) {
        <input
          #otpBox
          class="otp-input__box"
          [class.otp-input__box--filled]="digit !== ''"
          [class.otp-input__box--error]="hasError()"
          type="text"
          inputmode="numeric"
          maxlength="1"
          [value]="digit"
          [disabled]="disabled()"
          [attr.aria-label]="'Dígito ' + ($index + 1)"
          (input)="onDigitInput($index, $event)"
          (keydown)="onKeyDown($index, $event)"
          (paste)="onPaste($event)"
        />
      }
    </div>
  `,
  styleUrl: './otp-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
})
export class OtpInputComponent implements ControlValueAccessor {
  readonly hasError = input(false);
  readonly disabled = input(false);
  readonly completed = output<string>();

  readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('otpBox');

  digits: string[] = ['', '', '', '', '', ''];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  /**
   * Maneja la entrada de un dígito en una casilla.
   */
  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);

    this.digits[index] = value;
    input.value = value;
    this.emitValue();

    if (value && index < 5) {
      this.boxes()[index + 1]?.nativeElement.focus();
    }

    if (this.digits.every((d) => d !== '')) {
      this.completed.emit(this.digits.join(''));
    }
  }

  /**
   * Navegación con teclado entre casillas.
   */
  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.boxes()[index - 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.boxes()[index - 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      this.boxes()[index + 1]?.nativeElement.focus();
    }
  }

  /**
   * Permite pegar un código de 6 dígitos completo.
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pasted) return;

    for (let i = 0; i < 6; i++) {
      this.digits[i] = pasted[i] ?? '';
    }

    this.emitValue();
    const focusIndex = Math.min(pasted.length, 5);
    this.boxes()[focusIndex]?.nativeElement.focus();

    if (pasted.length === 6) {
      this.completed.emit(pasted);
    }
  }

  /** Limpia todas las casillas. */
  clear(): void {
    this.digits = ['', '', '', '', '', ''];
    this.emitValue();
    this.boxes()[0]?.nativeElement.focus();
  }

  writeValue(value: string | null): void {
    const code = (value ?? '').replace(/\D/g, '').slice(0, 6);
    this.digits = Array.from({ length: 6 }, (_, i) => code[i] ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private emitValue(): void {
    const value = this.digits.join('');
    this.onChange(value);
    this.onTouched();
  }
}
