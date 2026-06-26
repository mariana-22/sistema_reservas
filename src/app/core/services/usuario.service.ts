import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Usuario, UsuarioUI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private static readonly STORAGE_KEY = 'SISTEMA_USUARIO_ACTUAL';
  private usuarioActual$ = new BehaviorSubject<Usuario | null>(null);

  constructor(private supabaseService: SupabaseService) {
    const storedUsuario = localStorage.getItem(UsuarioService.STORAGE_KEY);
    if (storedUsuario) {
      try {
        this.usuarioActual$.next(JSON.parse(storedUsuario));
      } catch {
        localStorage.removeItem(UsuarioService.STORAGE_KEY);
      }
    }

    this.supabaseService.getAuthStatus().subscribe(async (isAuthenticated) => {
      if (isAuthenticated) {
        await this.cargarUsuarioActual();
      } else {
        this.clearUsuarioActual();
      }
    });

    this.cargarUsuarioActual();
  }

  private async cargarUsuarioActual() {
    try {
      const usuario = await this.supabaseService.getCurrentUser();
      if (usuario) {
        const usuarioData = await this.obtenerUsuarioPorId(usuario.id);
        this.setUsuarioActual(usuarioData || null);
      } else {
        this.clearUsuarioActual();
      }
    } catch (error) {
      console.error('Error al cargar usuario actual:', error);
      this.clearUsuarioActual();
    }
  }

  private setUsuarioActual(usuario: Usuario | null) {
    this.usuarioActual$.next(usuario);
    if (usuario) {
      localStorage.setItem(UsuarioService.STORAGE_KEY, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(UsuarioService.STORAGE_KEY);
    }
  }

  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual$.asObservable();
  }

  async obtenerTodos(): Promise<Usuario[]> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
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
    const client = this.supabaseService.getClient();
    
    if (!client) {
      const storedUsuario = localStorage.getItem(UsuarioService.STORAGE_KEY);
      if (storedUsuario) {
        try {
          const usuario = JSON.parse(storedUsuario) as Usuario;
          return usuario.id === id ? usuario : null;
        } catch {
          localStorage.removeItem(UsuarioService.STORAGE_KEY);
        }
      }
      return null;
    }

    try {
      const { data, error } = await client
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async crearUsuario(usuario: Omit<Usuario, 'fecha_registro' | 'fecha_actualizacion'>): Promise<Usuario> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
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

  async crearUsuarioSiNoExiste(user: any): Promise<Usuario | null> {
    if (!user?.id || !user?.email) {
      return null;
    }

    let existente: Usuario | null = null;
    try {
      existente = await this.obtenerUsuarioPorId(user.id);
    } catch (error) {
      console.warn('Advertencia: no se pudo obtener usuario de la base de datos.', error);
    }

    if (existente) {
      this.setUsuarioActual(existente);
      return existente;
    }

    const metadata = user.user_metadata || {};
    const nuevoUsuario: Omit<Usuario, 'fecha_registro' | 'fecha_actualizacion'> = {
      id: user.id,
      email: user.email,
      nombre: metadata.nombre || '',
      apellido: metadata.apellido || '',
      telefono: metadata.telefono || undefined,
      rol: metadata.rol || 'usuario'
    };

    try {
      const creado = await this.crearUsuario(nuevoUsuario);
      this.setUsuarioActual(creado);
      return creado;
    } catch (error) {
      console.warn('No se pudo crear usuario en la base de datos, usando almacenamiento local.', error);
      const fallbackUsuario: Usuario = {
        ...nuevoUsuario,
        fecha_registro: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      };
      this.setUsuarioActual(fallbackUsuario);
      return fallbackUsuario;
    }
  }

  clearUsuarioActual(): void {
    this.usuarioActual$.next(null);
    localStorage.removeItem(UsuarioService.STORAGE_KEY);
  }

  async actualizarUsuario(id: string, actualizaciones: Partial<Usuario>): Promise<Usuario> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
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
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { error } = await client
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
