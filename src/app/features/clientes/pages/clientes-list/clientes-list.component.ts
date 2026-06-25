import { Component } from '@angular/core';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [EmptyStateComponent],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.scss',
})
export class ClientesListComponent {}
