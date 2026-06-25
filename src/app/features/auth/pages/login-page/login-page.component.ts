import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  email = '';
  password = '';

  constructor(private readonly router: Router) {}

  onLogin(): void {
    // TODO: Implement real authentication
    localStorage.setItem('isAuthenticated', 'true');
    this.router.navigate(['/dashboard']);
  }
}
