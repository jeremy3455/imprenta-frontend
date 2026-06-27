import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientesService } from '../../services/clientes.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Cliente, SriConsultaResponse } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss',
})
export class ClienteFormComponent {
  private readonly clientesService = inject(ClientesService);
  private readonly notificationService = inject(NotificationService);

  readonly cliente = input<Cliente | null>(null);
  readonly cerrar = output<void>();

  readonly consultandoSri = signal(false);
  readonly datosSri = signal<SriConsultaResponse | null>(null);
  readonly editando = signal(false);

  readonly sriSearch$ = new Subject<string>();

  numeroCedulaRuc = '';
  razonSocial = '';
  direccion = '';
  email = '';
  telefono = '';
  tipoContribuyente = '';
  estado = true;

  constructor() {
    effect(() => {
      const c = this.cliente();
      if (c) {
        this.editando.set(true);
        this.numeroCedulaRuc = c.numeroCedulaRuc;
        this.razonSocial = c.razonSocial;
        this.direccion = c.direccion ?? '';
        this.email = c.email ?? '';
        this.telefono = c.telefono ?? '';
        this.tipoContribuyente = c.tipoContribuyente ?? '';
        this.estado = c.estado;
      }
    });

    this.sriSearch$.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      filter((val) => val.length === 10 || val.length === 13),
      tap(() => {
        this.consultandoSri.set(true);
        this.datosSri.set(null);
      }),
      switchMap((numero) => this.clientesService.consultarSri(numero)),
      takeUntilDestroyed(),
    ).subscribe({
      next: (res) => {
        this.consultandoSri.set(false);
        if (res.encontrado) {
          this.razonSocial = res.razonSocial;
          this.direccion = res.direccion ?? '';
          this.tipoContribuyente = res.tipoContribuyente ?? '';
          this.datosSri.set(res);
          this.notificationService.showSuccess('Datos obtenidos del SRI correctamente.', { title: 'SRI' });
        } else {
          this.notificationService.showWarning('Contribuyente no encontrado en el SRI.', { title: 'SRI' });
        }
      },
      error: () => {
        this.consultandoSri.set(false);
        this.notificationService.showError('El servicio del SRI no está disponible, ingresa los datos manualmente.', { title: 'SRI' });
      },
    });
  }

  onNumeroChange(value: string): void {
    const soloNumeros = value.replace(/\D/g, '');
    this.numeroCedulaRuc = soloNumeros;
    if (soloNumeros.length === 10 || soloNumeros.length === 13) {
      this.sriSearch$.next(soloNumeros);
    }
  }

  buscarSri(): void {
    const num = this.numeroCedulaRuc;
    if (num.length !== 10 && num.length !== 13) return;

    this.consultandoSri.set(true);
    this.datosSri.set(null);

    this.clientesService.consultarSri(num).subscribe({
      next: (res) => {
        this.consultandoSri.set(false);
        if (res.encontrado) {
          this.razonSocial = res.razonSocial;
          this.direccion = res.direccion ?? '';
          this.tipoContribuyente = res.tipoContribuyente ?? '';
          this.datosSri.set(res);
          this.notificationService.showSuccess('Datos obtenidos del SRI correctamente.', { title: 'SRI' });
        } else {
          this.notificationService.showWarning('Contribuyente no encontrado en el SRI.', { title: 'SRI' });
        }
      },
      error: () => {
        this.consultandoSri.set(false);
        this.notificationService.showError('El servicio del SRI no está disponible, ingresa los datos manualmente.', { title: 'SRI' });
      },
    });
  }

  guardar(): void {
    const num = this.numeroCedulaRuc;
    if (num.length !== 10 && num.length !== 13) {
      this.notificationService.showWarning('El número debe tener 10 (cédula) o 13 (RUC) dígitos.');
      return;
    }
    if (!this.razonSocial.trim()) {
      this.notificationService.showWarning('La razón social es obligatoria.');
      return;
    }

    const data = {
      numeroCedulaRuc: num,
      razonSocial: this.razonSocial.trim(),
      direccion: this.direccion.trim() || undefined,
      email: this.email.trim() || undefined,
      telefono: this.telefono.trim() || undefined,
      tipoContribuyente: this.tipoContribuyente.trim() || undefined,
    };

    const c = this.cliente();
    const request = c
      ? this.clientesService.update(c.id, data)
      : this.clientesService.create(data);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(c ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.');
        this.cerrar.emit();
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error al guardar el cliente.';
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
