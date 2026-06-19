import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recurso, Reserva, Usuario } from '../../../core/models';
import { RecursoService } from '../../../core/services/recurso.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnInit {
  recursos: Recurso[] = [];
  reservas: Reserva[] = [];
  usuarios: Usuario[] = [];
  cargando = false;
  error: string | null = null;
  estadisticas = {
    totalRecursos: 0,
    totalReservas: 0,
    totalUsuarios: 0,
    reservasConfirmadas: 0,
    recursosMasReservados: [] as { nombre: string; cantidad: number }[]
  };

  constructor(
    private recursoService: RecursoService,
    private reservaService: ReservaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private async cargarDatos() {
    this.cargando = true;
    this.error = null;

    try {
      // Cargar datos
      this.recursos = await this.recursoService.obtenerTodos();
      this.reservas = await this.reservaService.obtenerTodas();
      this.usuarios = await this.usuarioService.obtenerTodos();

      // Calcular estadísticas
      this.estadisticas.totalRecursos = this.recursos.length;
      this.estadisticas.totalReservas = this.reservas.length;
      this.estadisticas.totalUsuarios = this.usuarios.length;
      this.estadisticas.reservasConfirmadas = this.reservas.filter(r => r.estado === 'confirmada').length;

      // Recursos más reservados
      const recursoMap: { [key: string]: { nombre: string; cantidad: number } } = {};
      this.reservas.forEach(reserva => {
        const recurso = this.recursos.find(r => r.id === reserva.recurso_id);
        if (recurso) {
          if (!recursoMap[recurso.id]) {
            recursoMap[recurso.id] = { nombre: recurso.nombre, cantidad: 0 };
          }
          recursoMap[recurso.id].cantidad++;
        }
      });

      this.estadisticas.recursosMasReservados = Object.values(recursoMap)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);
    } catch (error) {
      console.error('Error al cargar datos de administración:', error);
      this.error = 'Error al cargar datos. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }
}
