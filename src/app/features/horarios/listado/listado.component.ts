import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Horario, Recurso } from '../../../core/models';
import { HorarioService } from '../../../core/services/horario.service';
import { RecursoService } from '../../../core/services/recurso.service';

@Component({
  selector: 'app-listado-horarios',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit {
  horarios: Horario[] = [];
  recursos: Recurso[] = [];
  recursoNombres: Record<string, string> = {};
  cargando = false;
  cargandoRecursos = false;
  error: string | null = null;
  exito: string | null = null;

  formularioHorario = new FormGroup({
    recurso_id: new FormControl('', Validators.required),
    dia_semana: new FormControl(1, [Validators.required, Validators.min(0), Validators.max(6)]),
    hora_inicio: new FormControl('09:00', Validators.required),
    hora_fin: new FormControl('10:00', Validators.required),
    disponible: new FormControl(true)
  });

  constructor(
    private horarioService: HorarioService,
    private recursoService: RecursoService
  ) {}

  async ngOnInit() {
    await Promise.all([this.cargarHorarios(), this.cargarRecursos()]);
  }

  private async cargarRecursos() {
    this.cargandoRecursos = true;
    this.error = null;

    try {
      this.recursos = await this.recursoService.obtenerTodos();
    } catch (error) {
      console.error('Error al cargar recursos:', error);
      const message = this.obtenerMensajeError(error);
      this.error = `No se pudieron cargar los recursos. ${message}`;
    } finally {
      this.cargandoRecursos = false;
    }
  }

  private async cargarHorarios() {
    this.cargando = true;
    this.error = null;
    this.exito = null;

    try {
      this.horarios = await this.horarioService.obtenerTodos();
      const recursoIds = Array.from(new Set(this.horarios.map(h => h.recurso_id)));

      await Promise.all(recursoIds.map(async recursoId => {
        try {
          const recurso = await this.recursoService.obtenerRecursoPorId(recursoId);
          this.recursoNombres[recursoId] = recurso?.nombre || 'Recurso desconocido';
        } catch (error) {
          console.error('Error al cargar nombre de recurso:', error);
          this.recursoNombres[recursoId] = 'Recurso desconocido';
        }
      }));
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      const message = this.obtenerMensajeError(error);
      this.error = `No se pudieron cargar los horarios. ${message}`;
    } finally {
      this.cargando = false;
    }
  }

  async crearHorario() {
    if (this.formularioHorario.invalid) {
      this.error = 'Completa todos los campos del formulario.';
      return;
    }

    this.cargando = true;
    this.error = null;
    this.exito = null;

    try {
      const nuevoHorario = {
        recurso_id: this.formularioHorario.value.recurso_id,
        dia_semana: Number(this.formularioHorario.value.dia_semana),
        hora_inicio: this.formularioHorario.value.hora_inicio,
        hora_fin: this.formularioHorario.value.hora_fin,
        disponible: this.formularioHorario.value.disponible
      } as Omit<Horario, 'id'>;

      await this.horarioService.crearHorario(nuevoHorario);
      this.exito = 'Horario creado correctamente.';
      this.formularioHorario.reset({
        recurso_id: '',
        dia_semana: 1,
        hora_inicio: '09:00',
        hora_fin: '10:00',
        disponible: true
      });
      await this.cargarHorarios();
    } catch (error) {
      console.error('Error al crear horario:', error);
      const message = this.obtenerMensajeError(error);
      this.error = `No se pudo crear el horario. ${message}`;
    } finally {
      this.cargando = false;
    }
  }

  private obtenerMensajeError(error: unknown): string {
    if (!error) {
      return 'Error desconocido.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object') {
      const anyError = error as any;
      return anyError.message || anyError.error_description || anyError.details || JSON.stringify(anyError);
    }

    return String(error);
  }

  obtenerNombreRecurso(recursoId: string) {
    return this.recursoNombres[recursoId] || 'Recurso desconocido';
  }

  formatearDia(dia: number) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia] ?? `Día ${dia}`;
  }
}
