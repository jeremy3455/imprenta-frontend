import { Component, input } from '@angular/core';

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
  readonly icon = input<string>('📂');
  readonly title = input<string>('Sin datos');
  readonly message = input<string>('No hay información disponible para mostrar.');
}
