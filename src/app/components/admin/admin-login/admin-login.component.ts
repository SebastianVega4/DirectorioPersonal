import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Panel de Administración</h2>
          <p class="text-gray-500 text-sm mt-1">Acceso restringido</p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input type="text" [(ngModel)]="username" name="username" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Ingresa tu usuario" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" [(ngModel)]="password" name="password" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Ingresa tu contraseña" />
            </div>
            @if (error) {
              <p class="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{{ error }}</p>
            }
            <button type="submit" [disabled]="loading"
              class="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.loading = true;
    this.error = '';

    if (!this.username || !this.password) {
      this.error = 'Por favor ingresa usuario y contraseña.';
      this.loading = false;
      return;
    }

    const result = await this.authService.signIn(this.username, this.password);

    if (result.error) {
      if (result.error.includes('Invalid login credentials')) {
        this.error = 'Usuario o contraseña incorrectos. Verifica tus credenciales.';
      } else if (result.error.includes('Email not confirmed')) {
        this.error = 'El correo no ha sido confirmado. Contacta al administrador.';
      } else {
        this.error = `Error: ${result.error}`;
      }
      this.loading = false;
    } else {
      this.router.navigate(['/admin-secreto/dashboard']);
    }
  }
}
