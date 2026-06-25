import { Component } from '@angular/core';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

/**
 * Página de listado de clientes.
 * Muestra una tabla con los clientes registrados, barra de búsqueda
 * y opciones para crear, editar y eliminar clientes.
 * Actualmente en estado inicial, muestra un componente de estado vacío.
 */
@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [EmptyStateComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent {}
