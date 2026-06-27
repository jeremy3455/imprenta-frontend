import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../models/cliente.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [FormsModule, EmptyStateComponent, ClienteFormComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(ConfirmService);

  readonly clientes = signal<Cliente[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingCliente = signal<Cliente | null>(null);

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.loading.set(true);

    this.clientesService.getAll().pipe(timeout(15_000)).subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al cargar los clientes.');
        this.loading.set(false);
      },
    });
  }

  abrirFormulario(cliente?: Cliente): void {
    this.editingCliente.set(cliente ?? null);
    this.showForm.set(true);
  }

  cerrarFormulario(): void {
    this.showForm.set(false);
    this.editingCliente.set(null);
    this.loadClientes();
  }

  editarCliente(cliente: Cliente): void {
    this.abrirFormulario(cliente);
  }

  async deleteCliente(id: number): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar cliente',
      message: '¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      type: 'danger',
    });
    if (!confirmed) return;

    this.clientesService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cliente eliminado correctamente.');
        this.loadClientes();
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al eliminar el cliente.');
      },
    });
  }
}
