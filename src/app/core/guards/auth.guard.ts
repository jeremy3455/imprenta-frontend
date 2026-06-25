import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * Guard de autenticación que protege las rutas privadas del módulo principal.
 * Redirige al login si el usuario no está autenticado.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  /**
   * Verifica si el usuario está autenticado consultando el localStorage.
   * Si no lo está, redirige a la página de login.
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
