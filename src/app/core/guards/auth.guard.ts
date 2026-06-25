import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(): boolean {
    // TODO: Implement real authentication check
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
