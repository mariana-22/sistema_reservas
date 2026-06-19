import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, UsuarioUI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioActual$ = new BehaviorSubject<Usuario | null>(null);

  constructor(private supabaseService: SupabaseService) {
    this.cargarUsuarioActual();
  }

  private async cargarUsuarioActual() {
    try {
      const usuario = await this.supabaseService.getCurrentUser();
      if (usuario) {
        const usuarioData = await this.obtenerUsuarioPorId(usuario.id);
        this.usuarioActual$.next(usuarioData || null);
      }
    } catch (error) {
      console.error('Error al cargar usuario actual:', error);
    }
  }

  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual$.asObservable();
  }

  async obtenerTodos(): Promise<Usuario[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('usuarios')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  async obtenerUsuarioPorId(id: string): Promise<Usuario | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  async crearUsuario(usuario: Omit<Usuario, 'id' | 'fecha_registro' | 'fecha_actualizacion'>): Promise<Usuario> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('usuarios')
        .insert([{
          ...usuario,
          fecha_registro: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async actualizarUsuario(id: string, actualizaciones: Partial<Usuario>): Promise<Usuario> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('usuarios')
        .update({
          ...actualizaciones,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      this.usuarioActual$.next(data);
      return data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  async eliminarUsuario(id: string): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}
