import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Recurso } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  // Servicio de recursos (requiere Supabase configurado)

  constructor(private supabaseService: SupabaseService) {}

  async obtenerTodos(): Promise<Recurso[]> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
        .from('recursos')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener recursos:', error);
      throw error;
    }
  }

  async obtenerRecursoPorId(id: string): Promise<Recurso | null> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
        .from('recursos')
        .select('*, horarios (*), reservas (*)')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error al obtener recurso:', error);
      throw error;
    }
  }

  async crearRecurso(recurso: Omit<Recurso, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Promise<Recurso> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
        .from('recursos')
        .insert([{
          ...recurso,
          fecha_creacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear recurso:', error);
      throw error;
    }
  }

  async actualizarRecurso(id: string, actualizaciones: Partial<Recurso>): Promise<Recurso> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
        .from('recursos')
        .update({ ...actualizaciones, fecha_actualizacion: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar recurso:', error);
      throw error;
    }
  }

  async eliminarRecurso(id: string): Promise<void> {
    const client = this.supabaseService.getClient();
    
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { error } = await client
        .from('recursos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      throw error;
    }
  }

  async buscarRecursos(nombre?: string, descripcion?: string, ubicacion?: string): Promise<Recurso[]> {
    return this.obtenerTodos();
  }
}
