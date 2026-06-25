import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticación que protege las rutas privadas del módulo principal.
 * Verifica la existencia de un token JWT válido en localStorage.
 * Redirige al login si el usuario no está autenticado.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Verifica si el usuario está autenticado mediante el AuthService.
   * @returns true si hay sesión activa, false en caso contrario
   */
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
