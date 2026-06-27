import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/producto.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Categoria, Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss',
})
export class ProductoFormComponent {
  private readonly productosService = inject(ProductosService);
  private readonly notificationService = inject(NotificationService);

  readonly producto = input<Producto | null>(null);
  readonly categorias = input<Categoria[]>([]);
  readonly cerrar = output<void>();

  readonly editando = signal(false);

  nombre = '';
  descripcion = '';
  precioUnitario = 0;
  categoriaId = 0;
  esDocumentoTributario = false;
  tipoContribuyenteAplicable = '';
  estado = true;

  constructor() {
    effect(() => {
      const p = this.producto();
      if (p) {
        this.editando.set(true);
        this.nombre = p.nombre;
        this.descripcion = p.descripcion ?? '';
        this.precioUnitario = p.precioUnitario;
        this.categoriaId = p.categoriaId;
        this.esDocumentoTributario = p.esDocumentoTributario;
        this.tipoContribuyenteAplicable = p.tipoContribuyenteAplicable ?? '';
        this.estado = p.estado;
      }
    });
  }

  guardar(): void {
    if (!this.nombre.trim()) {
      this.notificationService.showWarning('El nombre del producto es obligatorio.');
      return;
    }
    if (this.precioUnitario <= 0) {
      this.notificationService.showWarning('El precio unitario debe ser mayor a cero.');
      return;
    }
    if (!this.categoriaId || this.categoriaId <= 0) {
      this.notificationService.showWarning('Debes seleccionar una categoría.');
      return;
    }

    const data = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim() || undefined,
      precioUnitario: this.precioUnitario,
      categoriaId: this.categoriaId,
      esDocumentoTributario: this.esDocumentoTributario,
      tipoContribuyenteAplicable: this.esDocumentoTributario ? (this.tipoContribuyenteAplicable.trim() || undefined) : undefined,
    };

    const p = this.producto();
    const request = p
      ? this.productosService.update(p.id, data)
      : this.productosService.create(data);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          p ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'
        );
        this.cerrar.emit();
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error al guardar el producto.';
        const status = err.status;
        if (status === 400) {
          this.notificationService.showWarning(msg);
        } else if (status === 503) {
          this.notificationService.showError(msg, { duration: 0 });
        } else {
          this.notificationService.showError(msg);
        }
      },
    });
  }
}
