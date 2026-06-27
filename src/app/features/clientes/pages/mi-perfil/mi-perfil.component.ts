import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss',
})
export class MiPerfilComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  cliente: Cliente | null = null;
  loading = true;

  ngOnInit(): void {
    if (!this.authService.isCliente()) {
      this.router.navigate(['/']);
      return;
    }
    this.api.get<Cliente>('/clientes/mi-perfil').subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar tu perfil.');
        this.loading = false;
      },
    });
  }
}
