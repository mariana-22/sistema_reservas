import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const supabaseUrl = environment.supabase.url || localStorage.getItem('SUPABASE_URL') || (window as any)['SUPABASE_URL'];
    const supabaseKey = environment.supabase.anonKey || localStorage.getItem('SUPABASE_ANON_KEY') || (window as any)['SUPABASE_ANON_KEY'];

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.isConfigured = true;
        this.checkAuthStatus();
      } catch (error) {
        console.warn('⚠️ Error inicializando Supabase:', error);
      }
    } else {
      console.error('❌ Supabase no configurado. Establece `SUPABASE_URL` y `SUPABASE_ANON_KEY`.');
    }
  }

  private checkAuthStatus(): void {
    if (!this.supabase) return;
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.isAuthenticated$.next(!!session);
    });
  }

  getClient(): SupabaseClient | null {
    return this.supabase;
  }

  isReady(): boolean {
    return this.isConfigured;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  async signUp(email: string, password: string, userData: any) {
    if (!this.supabase) {
      throw new Error('Supabase no configurado');
    }
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });
      if (error) {
        const message = (error as any)?.message || 'Error en registro.';
        throw new Error(message);
      }
      return {
        ...data,
        user: data.user ?? (data.session as any)?.user ?? null
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    if (!this.supabase) {
      throw new Error('Supabase no configurado');
    }
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
    if (!this.supabase) {
      throw new Error('Supabase no configurado');
    }
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

    async getCurrentUser() {
    if (!this.supabase) {
      throw new Error('Supabase no configurado');
    }

    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      if ((error as any).name === 'AuthSessionMissingError') {
        return null;
      }
      throw error;
    }

    return data.user;
  }

  async getSession() {
    if (!this.supabase) {
      throw new Error('Supabase no configurado');
    }
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
}
