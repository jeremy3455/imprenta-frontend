import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';

/**
 * Página de inicio de sesión de la aplicación.
 * Muestra un formulario con campos de correo y contraseña.
 * Al enviar, autentica al usuario contra la API y redirige al dashboard.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Correo electrónico ingresado por el usuario */
  email = '';

  /** Contraseña ingresada por el usuario */
  password = '';

  /** Indica si hay una petición de login en curso */
  loading = false;

  /** Mensaje de error a mostrar */
  errorMessage = '';

  /**
   * Maneja el envío del formulario de login.
   * Llama al servicio de autenticación y redirige al dashboard
   * en caso de éxito, o muestra un mensaje de error.
   */
  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage =
          err.status === 401
            ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
            : 'Error al conectar con el servidor. Intenta nuevamente.';
        this.loading = false;
      },
    });
  }
}
