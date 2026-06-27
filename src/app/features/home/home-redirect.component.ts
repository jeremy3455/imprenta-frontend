import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  template: '',
})
export class HomeRedirectComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const destino = this.authService.isCliente() ? '/mi-perfil' : '/dashboard';
    this.router.navigate([destino], { replaceUrl: true });
  }
}
