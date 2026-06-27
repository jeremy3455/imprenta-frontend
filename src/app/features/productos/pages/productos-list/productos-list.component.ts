import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { ProductosService, ProductoFiltro } from '../../services/producto.service';
import { Categoria, Producto } from '../../models/producto.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ProductoFormComponent } from '../../components/producto-form/producto-form.component';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [FormsModule, EmptyStateComponent, ProductoFormComponent],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.scss',
})
export class ProductosListComponent implements OnInit {
  private readonly productosService = inject(ProductosService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmService = inject(ConfirmService);

  readonly productos = signal<Producto[]>([]);
  readonly categorias = signal<Categoria[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingProducto = signal<Producto | null>(null);

  search = '';
  filtroCategoriaId = 0;
  filtroEstado: boolean | '' = '';
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.productosService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data),
      error: () => this.categorias.set([]),
    });
  }

  cargarProductos(): void {
    this.loading.set(true);
    const filtro: ProductoFiltro = { page: this.page, pageSize: this.pageSize };
    if (this.search.trim()) filtro.search = this.search.trim();
    if (this.filtroCategoriaId > 0) filtro.categoriaId = this.filtroCategoriaId;
    if (this.filtroEstado !== '') filtro.estado = this.filtroEstado as boolean;

    this.productosService.getAll(filtro).pipe(timeout(15_000)).subscribe({
      next: (res) => {
        this.productos.set(res.items);
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al cargar productos.');
        this.loading.set(false);
      },
    });
  }

  filtrar(): void {
    this.page = 1;
    this.cargarProductos();
  }

  cambiarPagina(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.cargarProductos();
  }

  abrirFormulario(producto?: Producto): void {
    this.editingProducto.set(producto ?? null);
    this.showForm.set(true);
  }

  cerrarFormulario(): void {
    this.showForm.set(false);
    this.editingProducto.set(null);
    this.cargarProductos();
  }

  editarProducto(producto: Producto): void {
    this.abrirFormulario(producto);
  }

  async deleteProducto(id: number): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar producto',
      message: '¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      type: 'danger',
    });
    if (!confirmed) return;

    this.productosService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto eliminado correctamente.');
        this.cargarProductos();
      },
      error: (err) => {
        this.notificationService.showError(err.message || 'Error al eliminar el producto.');
      },
    });
  }

  formatearPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }

  get paginas(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(1, this.page - 2);
    const fin = Math.min(this.totalPages, this.page + 2);
    for (let i = inicio; i <= fin; i++) paginas.push(i);
    return paginas;
  }
}
