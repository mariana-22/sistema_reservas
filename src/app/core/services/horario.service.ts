import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Horario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  constructor(private supabaseService: SupabaseService) {}

  async obtenerTodos(): Promise<Horario[]> {
    const client = this.supabaseService.getClient();
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
        .from('horarios')
        .select('*')
        .order('recurso_id')
        .order('dia_semana')
        .order('hora_inicio');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      throw error;
    }
  }

  async crearHorario(horario: Omit<Horario, 'id'>): Promise<Horario> {
    const client = this.supabaseService.getClient();
    if (!client) {
      throw new Error('Supabase no configurado');
    }

    try {
      const { data, error } = await client
        .from('horarios')
        .insert([horario])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  }
}
