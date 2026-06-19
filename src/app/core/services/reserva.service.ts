import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Reserva, ReservaUI } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  constructor(private supabaseService: SupabaseService) {}

  async obtenerTodas(): Promise<Reserva[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .select('*')
        .order('fecha_inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  }

  async obtenerReservasPorUsuario(usuarioId: string): Promise<Reserva[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('fecha_inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener reservas del usuario:', error);
      throw error;
    }
  }

  async obtenerReservasPorRecurso(recursoId: string): Promise<Reserva[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .select('*')
        .eq('recurso_id', recursoId)
        .eq('estado', 'confirmada')
        .order('fecha_inicio');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener reservas del recurso:', error);
      throw error;
    }
  }

  async obtenerReservaPorId(id: string): Promise<Reserva | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error al obtener reserva:', error);
      throw error;
    }
  }

  async validarConflictoHorario(
    recursoId: string,
    fechaInicio: string,
    fechaFin: string,
    horaInicio: string,
    horaFin: string
  ): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .select('*')
        .eq('recurso_id', recursoId)
        .eq('estado', 'confirmada')
        .lte('fecha_inicio', fechaFin)
        .gte('fecha_fin', fechaInicio);

      if (error) throw error;

      // Validar solapamiento de horarios
      if (data && data.length > 0) {
        for (const reserva of data) {
          if (this.hayConflictoHorario(horaInicio, horaFin, reserva.hora_inicio, reserva.hora_fin)) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error al validar conflicto de horario:', error);
      throw error;
    }
  }

  private hayConflictoHorario(inicio1: string, fin1: string, inicio2: string, fin2: string): boolean {
    return inicio1 < fin2 && fin1 > inicio2;
  }

  async crearReserva(reserva: Omit<Reserva, 'id' | 'fecha_creacion'>): Promise<Reserva> {
    try {
      // Validar conflictos
      const hayConflicto = await this.validarConflictoHorario(
        reserva.recurso_id,
        reserva.fecha_inicio,
        reserva.fecha_fin,
        reserva.hora_inicio,
        reserva.hora_fin
      );

      if (hayConflicto) {
        throw new Error('Hay un conflicto de horario con otra reserva');
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .insert([{
          ...reserva,
          fecha_creacion: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  async actualizarReserva(id: string, actualizaciones: Partial<Reserva>): Promise<Reserva> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .update(actualizaciones)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      throw error;
    }
  }

  async cancelarReserva(id: string): Promise<Reserva> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('reservas')
        .update({
          estado: 'cancelada',
          fecha_cancelacion: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  }
}
