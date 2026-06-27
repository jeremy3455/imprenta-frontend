/**
 * Respuesta al solicitar un código OTP.
 */
export interface RequestOtpResponse {
  message: string;
  maskedEmail: string;
  expiresInSeconds: number;
}

/**
 * Solicitud de verificación OTP.
 */
export interface VerifyOtpRequest {
  email: string;
  code: string;
}
