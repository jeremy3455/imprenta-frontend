import { Component, OnInit, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedido.service';
import { CreatePedidoRequest, CreateDetallePedidoRequest } from '../../models/pedido.model';
import { ProductosService } from '../../../productos/services/producto.service';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { Producto } from '../../../productos/models/producto.model';
import { Cliente } from '../../../clientes/models/cliente.model';
import { NotificationService } from '../../../../core/services/notification.service';

interface LineaItem {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  esDocumentoTributario: boolean;
}

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.scss',
})
export class PedidoFormComponent implements OnInit {
  private readonly pedidosService = inject(PedidosService);
  private readonly productosService = inject(ProductosService);
  private readonly clientesService = inject(ClientesService);
  private readonly notificationService = inject(NotificationService);

  readonly cerrar = output<void>();

  readonly clientes = signal<Cliente[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly guardando = signal(false);
  readonly lineas = signal<LineaItem[]>([]);

  clienteId = 0;
  formaPago: 'CONTADO' | 'CREDITO' = 'CONTADO';
  montoAnticipo = 0;
  fechaVencimientoCredito = '';
  observaciones = '';

  productoSeleccionadoId = 0;
  cantidadItem = 1;
  precioItem = 0;

  ngOnInit(): void {
    this.clientesService.getAll(true).subscribe({
      next: (data) => this.clientes.set(data),
      error: () => this.clientes.set([]),
    });
    this.productosService.getAll({ estado: true, pageSize: 500 }).subscribe({
      next: (res) => this.productos.set(res.items),
      error: () => this.productos.set([]),
    });
  }

  agregarLinea(): void {
    console.log('[agregarLinea] productoSeleccionadoId:', this.productoSeleccionadoId, 'tipo:', typeof this.productoSeleccionadoId);
    console.log('[agregarLinea] cantidadItem:', this.cantidadItem, 'precioItem:', this.precioItem);

    if (!this.productoSeleccionadoId || this.productoSeleccionadoId <= 0) {
      console.warn('[agregarLinea] FALLA: producto no seleccionado o invalido');
      this.notificationService.showWarning('Selecciona un producto.');
      return;
    }
    if (this.cantidadItem <= 0) {
      console.warn('[agregarLinea] FALLA: cantidad invalida');
      this.notificationService.showWarning('La cantidad debe ser mayor a cero.');
      return;
    }
    if (this.precioItem <= 0) {
      console.warn('[agregarLinea] FALLA: precio invalido');
      this.notificationService.showWarning('El precio unitario debe ser mayor a cero.');
      return;
    }

    const prod = this.productos().find(p => p.id === this.productoSeleccionadoId);
    console.log('[agregarLinea] prod encontrado:', prod);
    if (!prod) {
      console.warn('[agregarLinea] FALLA: prod no encontrado en lista, productos disponibles:', this.productos().map(p => ({ id: p.id, tipo: typeof p.id, nombre: p.nombre })));
      return;
    }

    if (this.lineas().some(l => l.productoId === this.productoSeleccionadoId)) {
      console.warn('[agregarLinea] FALLA: producto ya agregado');
      this.notificationService.showWarning('El producto ya está agregado al pedido.');
      return;
    }

    this.lineas.update(list => [...list, {
      productoId: prod.id,
      nombreProducto: prod.nombre,
      cantidad: this.cantidadItem,
      precioUnitario: this.precioItem,
      esDocumentoTributario: prod.esDocumentoTributario,
    }]);

    this.productoSeleccionadoId = 0;
    this.cantidadItem = 1;
    this.precioItem = 0;
  }

  quitarLinea(productoId: number): void {
    this.lineas.update(list => list.filter(l => l.productoId !== productoId));
  }

  onProductoChange(): void {
    console.log('[onProductoChange] productoSeleccionadoId:', this.productoSeleccionadoId, 'tipo:', typeof this.productoSeleccionadoId);
    const prod = this.productos().find(p => p.id === this.productoSeleccionadoId);
    if (prod) {
      console.log('[onProductoChange] encontrado, precio:', prod.precioUnitario);
      this.precioItem = prod.precioUnitario;
    } else {
      console.warn('[onProductoChange] NO encontrado en productos');
    }
  }

  get montoTotal(): number {
    return this.lineas().reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0);
  }

  get montoPendiente(): number {
    if (this.formaPago === 'CREDITO') {
      return this.montoTotal - this.montoAnticipo;
    }
    return 0;
  }

  guardar(): void {
    if (!this.clienteId) {
      this.notificationService.showWarning('Debes seleccionar un cliente.');
      return;
    }
    if (this.lineas().length === 0) {
      this.notificationService.showWarning('Debes agregar al menos un producto.');
      return;
    }

    const items: CreateDetallePedidoRequest[] = this.lineas().map(l => ({
      productoId: l.productoId,
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario,
    }));

    const data: CreatePedidoRequest = {
      clienteId: this.clienteId,
      formaPago: this.formaPago,
      montoAnticipo: this.formaPago === 'CREDITO' ? this.montoAnticipo : 0,
      fechaVencimientoCredito: this.formaPago === 'CREDITO' && this.fechaVencimientoCredito
        ? this.fechaVencimientoCredito : undefined,
      observaciones: this.observaciones.trim() || undefined,
      items,
    };

    this.guardando.set(true);
    this.pedidosService.create(data).subscribe({
      next: () => {
        this.notificationService.showSuccess('Pedido creado correctamente.');
        this.guardando.set(false);
        this.cerrar.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        const msg = err.error?.message || err.message || 'Error al crear el pedido.';
        if (err.status === 400) {
          this.notificationService.showWarning(msg);
        } else {
          this.notificationService.showError(msg);
        }
      },
    });
  }
}
