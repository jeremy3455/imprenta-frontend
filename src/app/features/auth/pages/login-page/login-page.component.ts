import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Página de inicio de sesión de la aplicación.
 * Muestra un formulario con campos de correo y contraseña.
 * Al enviar, autentica al usuario y redirige al dashboard.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  /** Correo electrónico ingresado por el usuario */
  email = '';

  /** Contraseña ingresada por el usuario */
  password = '';

  constructor(private readonly router: Router) {}

  /**
   * Maneja el envío del formulario de login.
   * Almacena el estado de autenticación y redirige al dashboard.
   */
  onLogin(): void {
    localStorage.setItem('isAuthenticated', 'true');
    this.router.navigate(['/dashboard']);
  }
}
