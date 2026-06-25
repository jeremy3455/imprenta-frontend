import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Cliente, CreateClienteRequest } from '../../models/cliente.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

/**
 * Página de listado de clientes.
 * Muestra una tabla con los clientes registrados obtenidos desde la API.
 * Permite crear nuevos clientes mediante un formulario inline.
 */
@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [FormsModule, EmptyStateComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent implements OnInit {
  private readonly clientesService = inject(ClientesService);

  /** Lista de clientes obtenida desde la API */
  clientes: Cliente[] = [];

  /** Indica si los datos están cargando */
  loading = true;

  /** Indica si ocurrió un error */
  hasError = false;

  /** Mensaje de error */
  errorMessage = '';

  /** Controla la visibilidad del formulario de creación */
  showCreateForm = false;

  /** Modelo para el formulario de nuevo cliente */
  nuevoCliente: CreateClienteRequest = {
    nombre: '',
    email: '',
    telefono: '',
    calle: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
  };

  ngOnInit(): void {
    this.loadClientes();
  }

  /**
   * Obtiene la lista de clientes desde el servicio.
   */
  loadClientes(): void {
    this.loading = true;
    this.hasError = false;

    this.clientesService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = err.message || 'Error al cargar los clientes.';
        this.loading = false;
      },
    });
  }

  /**
   * Abre o cierra el formulario de creación de cliente.
   */
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  /**
   * Crea un nuevo cliente llamando al servicio.
   */
  createCliente(): void {
    this.clientesService.create(this.nuevoCliente).subscribe({
      next: () => {
        this.loadClientes();
        this.showCreateForm = false;
        this.resetForm();
      },
      error: (err) => {
        this.hasError = true;
        this.errorMessage = err.message || 'Error al crear el cliente.';
      },
    });
  }

  /**
   * Elimina un cliente por su Id con confirmación.
   * @param id - Identificador del cliente a eliminar
   */
  deleteCliente(id: string): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientesService.delete(id).subscribe({
        next: () => this.loadClientes(),
        error: (err) => {
          this.hasError = true;
          this.errorMessage = err.message || 'Error al eliminar el cliente.';
        },
      });
    }
  }

  /**
   * Reinicia los valores del formulario de creación.
   */
  private resetForm(): void {
    this.nuevoCliente = {
      nombre: '',
      email: '',
      telefono: '',
      calle: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
    };
  }
}
