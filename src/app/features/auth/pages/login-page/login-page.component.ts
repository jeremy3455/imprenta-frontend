import { DecimalPipe } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OtpInputComponent } from '../../components/otp-input/otp-input.component';

type LoginStep = 'credentials' | 'otp';

/**
 * Página de inicio de sesión con verificación OTP en dos pasos.
 * Paso 1: credenciales. Paso 2: código de 6 dígitos enviado al correo.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, OtpInputComponent, DecimalPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  private readonly otpInput = viewChild(OtpInputComponent);

  /** Paso actual del flujo de login */
  readonly step = signal<LoginStep>('credentials');

  /** Correo electrónico */
  email = '';

  /** Contraseña */
  password = '';

  /** Código OTP ingresado */
  otpCode = '';

  /** Correo enmascarado mostrado en paso OTP */
  readonly maskedEmail = signal('');

  /** Segundos restantes para expiración del OTP */
  readonly expiresInSeconds = signal(0);

  /** Indica si hay una petición en curso */
  readonly loading = signal(false);

  /** Error de validación del OTP */
  readonly otpError = signal(false);

  /** Error de validación de credenciales en el formulario */
  readonly credentialsError = signal<string | null>(null);

  /**
   * Valida credenciales y solicita el envío del código OTP.
   */
  onRequestOtp(): void {
    this.credentialsError.set(null);

    if (!this.isValidEmail(this.email)) {
      this.credentialsError.set('Ingresa un correo electrónico válido.');
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.credentialsError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.loading.set(true);

    const credentials: LoginRequest = {
      email: this.email.trim(),
      password: this.password,
    };

    this.authService.requestOtp(credentials).subscribe({
      next: (response) => {
        this.maskedEmail.set(response.maskedEmail);
        this.expiresInSeconds.set(response.expiresInSeconds);
        this.step.set('otp');
        this.otpCode = '';
        this.otpError.set(false);
        this.loading.set(false);
        this.notificationService.showInfo(
          `Código enviado a ${response.maskedEmail}`,
          { title: 'Verificación' }
        );
      },
      error: (err) => {
        const message =
          err.status === 401
            ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
            : 'Error al conectar con el servidor. Intenta nuevamente.';
        this.credentialsError.set(message);
        this.notificationService.showError(message);
        this.loading.set(false);
      },
    });
  }

  /**
   * Verifica el código OTP y completa el inicio de sesión.
   */
  onVerifyOtp(): void {
    if (!this.isValidOtp(this.otpCode)) {
      this.otpError.set(true);
      this.notificationService.showWarning('El código debe tener 6 dígitos numéricos.');
      return;
    }

    this.loading.set(true);
    this.otpError.set(false);

    this.authService
      .verifyOtp({ email: this.email.trim(), code: this.otpCode })
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Bienvenido de nuevo.');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.otpError.set(true);
          const message =
            err.error?.message ?? 'Código inválido o expirado. Solicita uno nuevo.';
          this.notificationService.showError(message);
          this.loading.set(false);
        },
      });
  }

  /**
   * Reenvía el código OTP usando las mismas credenciales.
   */
  onResendOtp(): void {
    this.otpInput()?.clear();
    this.otpCode = '';
    this.otpError.set(false);
    this.onRequestOtp();
  }

  /**
   * Regresa al paso de credenciales.
   */
  backToCredentials(): void {
    this.step.set('credentials');
    this.otpCode = '';
    this.otpError.set(false);
    this.credentialsError.set(null);
  }

  /**
   * Actualiza el código OTP desde el componente de entrada.
   * @param code - Código de 6 dígitos
   */
  onOtpChange(code: string): void {
    this.otpCode = code;
    if (this.otpError() && this.isValidOtp(code)) {
      this.otpError.set(false);
    }
  }

  /**
   * Auto-envía cuando se completan los 6 dígitos.
   * @param code - Código completo
   */
  onOtpCompleted(code: string): void {
    this.otpCode = code;
    this.onVerifyOtp();
  }

  /** Valida formato de correo electrónico. */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /** Valida que el OTP tenga exactamente 6 dígitos. */
  private isValidOtp(code: string): boolean {
    return /^\d{6}$/.test(code);
  }
}
