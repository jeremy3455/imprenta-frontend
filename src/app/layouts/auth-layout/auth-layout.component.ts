import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout para las páginas de autenticación (login, registro, etc.).
 * Renderiza únicamente el router-outlet sin elementos visuales
 * adicionales como sidebar o header.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AuthLayoutComponent {}
