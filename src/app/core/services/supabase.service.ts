import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] || process.env['SUPABASE_URL'];
    const supabaseKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] || process.env['SUPABASE_ANON_KEY'];

    if (!supabaseUrl || !supabaseKey) {
      console.error('Variables de entorno de Supabase no configuradas');
    }

    this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.isAuthenticated$.next(!!session);
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
}
