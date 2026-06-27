import { Component, input } from '@angular/core';

/**
 * Componente reutilizable para mostrar un estado vacío o sin datos.
 * Se usa en listas y tablas cuando no hay registros que mostrar.
 * Permite personalizar el ícono, título y mensaje descriptivo.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">{{ icon() }}</div>
      <h3 class="empty-state__title">{{ title() }}</h3>
      <p class="empty-state__message">{{ message() }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  /** Ícono decorativo que representa el estado vacío */
  readonly icon = input<string>('📂');

  /** Título principal del estado vacío */
  readonly title = input<string>('Sin datos');

  /** Mensaje descriptivo adicional */
  readonly message = input<string>('No hay información disponible para mostrar.');
}
