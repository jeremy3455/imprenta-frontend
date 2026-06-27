import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { RequestOtpResponse, VerifyOtpRequest } from '../../features/auth/models/otp.model';

/**
 * Interfaz que representa la respuesta del endpoint de autenticación.
 */
export interface AuthResponse {
  /** Token JWT de acceso */
  token: string;
  /** Nombre del usuario */
  nombre: string;
  /** Correo electrónico */
  email: string;
  /** Rol del usuario (Admin, Operador, Cliente) */
  rol: string;
}

/**
 * Interfaz para la solicitud de inicio de sesión.
 */
export interface LoginRequest {
  /** Correo electrónico */
  email: string;
  /** Contraseña */
  password: string;
}

/**
 * Servicio de autenticación.
 * Maneja el login, registro y gestión del token JWT en localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  /**
   * Solicita un código OTP tras validar email y contraseña.
   * @param credentials - Credenciales de acceso
   * @returns Observable con correo enmascarado y tiempo de expiración
   */
  requestOtp(credentials: LoginRequest): Observable<RequestOtpResponse> {
    return this.api.post<RequestOtpResponse>('/auth/request-otp', credentials);
  }

  /**
   * Verifica el código OTP y completa el inicio de sesión.
   * @param request - Correo y código de 6 dígitos
   * @returns Observable con token JWT y datos del usuario
   */
  verifyOtp(request: VerifyOtpRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/verify-otp', request).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  /**
   * Inicia sesión con las credenciales proporcionadas (flujo directo sin OTP).
   * Almacena el token y los datos del usuario en localStorage.
   * @param credentials - Credenciales de acceso
   * @returns Observable con la respuesta del servidor
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  /**
   * Cierra la sesión del usuario actual.
   * Elimina el token y los datos del usuario de localStorage.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verifica si el usuario tiene una sesión activa.
   * @returns true si existe un token almacenado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token JWT almacenado.
   * @returns El token o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Almacena la sesión del usuario en localStorage.
   * @param response - Respuesta de autenticación con token y datos
   */
  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      nombre: response.nombre,
      email: response.email,
      rol: response.rol,
    }));
  }
}
