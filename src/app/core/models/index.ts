export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'admin' | 'usuario';
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface Recurso {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: number;
  tipo: string;
  estado: 'activo' | 'inactivo';
  horario_inicio: string;
  horario_fin: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Reserva {
  id: string;
  usuario_id: string;
  recurso_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'confirmada' | 'cancelada' | 'pendiente';
  motivo?: string;
  notas?: string;
  fecha_creacion: string;
  fecha_cancelacion?: string;
}

export interface Horario {
  id: string;
  recurso_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
}

export interface UsuarioUI extends Usuario {
  reservas?: Reserva[];
}

export interface RecursoUI extends Recurso {
  reservas?: Reserva[];
  horarios?: Horario[];
}

export interface ReservaUI extends Reserva {
  usuario?: Usuario;
  recurso?: Recurso;
}
