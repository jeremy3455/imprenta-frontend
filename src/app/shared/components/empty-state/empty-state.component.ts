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
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        text-align: center;
        color: #666;
      }
      .empty-state__icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .empty-state__title {
        font-size: 1.25rem;
        margin: 0 0 0.5rem;
        color: #333;
      }
      .empty-state__message {
        font-size: 0.9rem;
        margin: 0;
        max-width: 400px;
      }
    `,
  ],
})
export class EmptyStateComponent {
  /** Ícono decorativo que representa el estado vacío */
  readonly icon = input<string>('📂');

  /** Título principal del estado vacío */
  readonly title = input<string>('Sin datos');

  /** Mensaje descriptivo adicional */
  readonly message = input<string>('No hay información disponible para mostrar.');
}
