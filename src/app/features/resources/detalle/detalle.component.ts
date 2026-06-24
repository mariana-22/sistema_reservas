import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recurso, Reserva } from '../../../core/models';
import { RecursoService } from '../../../core/services/recurso.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-detalle-recurso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent implements OnInit {
  recurso: Recurso | null = null;
  reservas: Reserva[] = [];
  cargando = false;
  error: string | null = null;
  exito: string | null = null;
  formularioReserva!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private recursoService: RecursoService,
    private reservaService: ReservaService,
    private usuarioService: UsuarioService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarRecurso();
  }

  private inicializarFormulario() {
    this.formularioReserva = this.formBuilder.group({
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  private async cargarRecurso() {
    this.cargando = true;
    this.error = null;

    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.error = 'Recurso no encontrado';
        return;
      }

      const recursoData = await this.recursoService.obtenerRecursoPorId(id);
      if (!recursoData) {
        this.error = 'Recurso no encontrado';
        return;
      }

      this.recurso = recursoData;
      this.reservas = await this.reservaService.obtenerReservasPorRecurso(id);
    } catch (error) {
      console.error('Error al cargar recurso:', error);
      this.error = 'Error al cargar el recurso. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }

  async enviarReserva() {
    if (this.formularioReserva.invalid || !this.recurso) {
      this.error = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.error = null;
    this.exito = null;

    try {
      const usuario = await firstValueFrom(this.usuarioService.getUsuarioActual());
      if (!usuario) {
        this.error = 'Usuario no autenticado';
        return;
      }

      const { fecha_inicio, fecha_fin, hora_inicio, hora_fin, motivo } = this.formularioReserva.value;

      const nuevaReserva = {
        usuario_id: usuario.id,
        recurso_id: this.recurso.id,
        fecha_inicio,
        fecha_fin,
        hora_inicio,
        hora_fin,
        estado: 'confirmada' as const,
        motivo
      };

      await this.reservaService.crearReserva(nuevaReserva);
      this.exito = 'Reserva realizada exitosamente';
      this.formularioReserva.reset();
      
      // Recargar reservas
      await this.cargarRecurso();
      
      setTimeout(() => {
        this.router.navigate(['/reservas']);
      }, 2000);
    } catch (error) {
      console.error('Error al crear reserva:', error);
      this.error = error instanceof Error ? error.message : 'Error al crear la reserva. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }
}
