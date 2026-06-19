import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reserva, Usuario, Recurso } from '../../../core/models';
import { ReservaService } from '../../../core/services/reserva.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RecursoService } from '../../../core/services/recurso.service';

@Component({
  selector: 'app-listado-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit {
  reservas: Reserva[] = [];
  usuarioActual: Usuario | null = null;
  cargando = false;
  error: string | null = null;
  mapaRecursos: { [key: string]: Recurso } = {};

  constructor(
    private reservaService: ReservaService,
    private usuarioService: UsuarioService,
    private recursoService: RecursoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private async cargarDatos() {
    this.cargando = true;
    this.error = null;

    try {
      // Obtener usuario actual
      this.usuarioActual = await this.usuarioService.getUsuarioActual().toPromise() || null;

      if (!this.usuarioActual) {
        this.error = 'No hay usuario autenticado';
        return;
      }

      // Obtener reservas del usuario
      this.reservas = await this.reservaService.obtenerReservasPorUsuario(this.usuarioActual.id);

      // Cargar información de recursos
      for (const reserva of this.reservas) {
        if (!this.mapaRecursos[reserva.recurso_id]) {
          const recurso = await this.recursoService.obtenerRecursoPorId(reserva.recurso_id);
          if (recurso) {
            this.mapaRecursos[reserva.recurso_id] = recurso;
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      this.error = 'Error al cargar tus reservas. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }

  async cancelarReserva(reservaId: string) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      await this.reservaService.cancelarReserva(reservaId);
      this.reservas = this.reservas.map(r =>
        r.id === reservaId ? { ...r, estado: 'cancelada' as const } : r
      );
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      this.error = 'Error al cancelar la reserva. Por favor, intenta de nuevo.';
    }
  }

  getNombreRecurso(recursoId: string): string {
    return this.mapaRecursos[recursoId]?.nombre || 'Recurso';
  }

  getEstadoClase(estado: string): string {
    return `estado-${estado}`;
  }
}
