import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { ProductosService } from '../../../productos/services/producto.service';
import { Producto } from '../../../productos/models/producto.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface ItemSeleccionado {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
}

@Component({
  selector: 'app-solicitar-producto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './solicitar-producto.component.html',
  styleUrl: './solicitar-producto.component.scss',
})
export class SolicitarProductoComponent implements OnInit {
  private readonly solicitudService = inject(SolicitudService);
  private readonly productoService = inject(ProductosService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  productos: Producto[] = [];
  loading = true;
  submitting = false;

  formaPago = 'EFECTIVO';
  observacion = '';
  productoSeleccionadoId = 0;
  cantidad = 1;
  items: ItemSeleccionado[] = [];

  ngOnInit(): void {
    if (!this.authService.isCliente()) {
      this.router.navigate(['/']);
      return;
    }
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.getAll({ page: 1, pageSize: 200 }).subscribe({
      next: (data) => {
        this.productos = data.items;
        this.loading = false;
      },
      error: () => {
        this.notificationService.showError('Error al cargar productos.');
        this.loading = false;
      },
    });
  }

  agregarItem(): void {
    if (!this.productoSeleccionadoId || this.cantidad < 1) return;
    const producto = this.productos.find((p) => p.id === this.productoSeleccionadoId);
    if (!producto) return;
    if (this.items.some((i) => i.productoId === producto.id)) {
      this.notificationService.showInfo('El producto ya está agregado.');
      return;
    }
    this.items.push({
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: this.cantidad,
    });
    this.productoSeleccionadoId = 0;
    this.cantidad = 1;
  }

  eliminarItem(productoId: number): void {
    this.items = this.items.filter((i) => i.productoId !== productoId);
  }

  onSubmit(): void {
    if (this.items.length === 0) {
      this.notificationService.showError('Debe agregar al menos un producto.');
      return;
    }
    this.submitting = true;
    this.solicitudService
      .create({
        formaPago: this.formaPago,
        observacion: this.observacion || undefined,
        items: this.items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
      })
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Solicitud enviada correctamente.');
          this.router.navigate(['/mis-solicitudes']);
        },
        error: () => {
          this.notificationService.showError('Error al enviar la solicitud.');
          this.submitting = false;
        },
      });
  }
}
