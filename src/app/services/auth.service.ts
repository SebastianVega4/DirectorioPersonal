import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private supabase: SupabaseService) {
    this.checkSession();
  }

  get authenticated$() {
    return this.isLoggedIn$.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isLoggedIn$.value;
  }

  private async checkSession() {
    const { data } = await this.supabase.supabase.auth.getSession();
    this.isLoggedIn$.next(!!data.session);
  }

  async signIn(username: string, password: string): Promise<{ error?: string }> {
    const email = `${username}@directorio.admin`;
    console.log('Intentando login con email:', email);
    const { data, error } = await this.supabase.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Error de autenticación:', error.message, error.status);
      return { error: error.message };
    }
    console.log('Login exitoso para:', data.user?.email);
    this.isLoggedIn$.next(true);
    return {};
  }

  async signOut(): Promise<void> {
    await this.supabase.supabase.auth.signOut();
    this.isLoggedIn$.next(false);
  }
}
