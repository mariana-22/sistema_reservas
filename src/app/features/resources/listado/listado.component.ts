import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recurso, Usuario } from '../../../core/models';
import { RecursoService } from '../../../core/services/recurso.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-listado-recursos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit, OnDestroy {
  recursos: Recurso[] = [];
  recursosFiltrados: Recurso[] = [];
  recursoForm!: FormGroup;
  cargando = false;
  error: string | null = null;
  success: string | null = null;
  filtro = '';
  isAdmin = false;
  adminFormVisible = false;
  editingRecurso: Recurso | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private recursoService: RecursoService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarioActual()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario | null) => {
        this.isAdmin = !!usuario && usuario.rol === 'admin';
      });

    this.cargarRecursos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async cargarRecursos() {
    this.cargando = true;
    this.error = null;

    try {
      this.recursos = await this.recursoService.obtenerTodos();
      this.aplicarFiltro();
    } catch (error) {
      console.error('Error al cargar recursos:', error);
      this.error = 'Error al cargar recursos. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }

  async aplicarFiltro() {
    const query = this.filtro.trim().toLowerCase();
    if (!query) {
      this.recursosFiltrados = [...this.recursos];
      return;
    }

    this.recursosFiltrados = this.recursos.filter(r =>
      r.nombre.toLowerCase().includes(query) ||
      r.descripcion.toLowerCase().includes(query) ||
      r.ubicacion.toLowerCase().includes(query) ||
      r.tipo.toLowerCase().includes(query)
    );
  }

  private inicializarFormulario() {
    this.recursoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', [Validators.required, Validators.minLength(3)]],
      capacidad: [1, [Validators.required, Validators.min(1)]],
      horario_inicio: ['09:00', Validators.required],
      horario_fin: ['18:00', Validators.required]
    });
  }

  abrirCrearRecurso() {
    this.adminFormVisible = true;
    this.editingRecurso = null;
    this.success = null;
    this.error = null;
    this.recursoForm.reset({
      nombre: '',
      descripcion: '',
      ubicacion: '',
      tipo: '',
      capacidad: 1,
      horario_inicio: '09:00',
      horario_fin: '18:00'
    });
  }

  abrirEditarRecurso(recurso: Recurso) {
    this.adminFormVisible = true;
    this.editingRecurso = recurso;
    this.success = null;
    this.error = null;
    this.recursoForm.setValue({
      nombre: recurso.nombre,
      descripcion: recurso.descripcion,
      ubicacion: recurso.ubicacion,
      tipo: recurso.tipo,
      capacidad: recurso.capacidad,
      horario_inicio: recurso.horario_inicio,
      horario_fin: recurso.horario_fin
    });
  }

  cerrarFormulario() {
    this.adminFormVisible = false;
    this.editingRecurso = null;
    this.error = null;
    this.success = null;
  }

  async guardarRecurso() {
    if (this.recursoForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.cargando = true;
    this.error = null;
    this.success = null;

    const recursoData = {
      nombre: this.recursoForm.value.nombre,
      descripcion: this.recursoForm.value.descripcion,
      ubicacion: this.recursoForm.value.ubicacion,
      tipo: this.recursoForm.value.tipo,
      capacidad: Number(this.recursoForm.value.capacidad),
      horario_inicio: this.recursoForm.value.horario_inicio,
      horario_fin: this.recursoForm.value.horario_fin,
      estado: 'activo' as const
    };

    try {
      if (this.editingRecurso) {
        await this.recursoService.actualizarRecurso(this.editingRecurso.id, recursoData);
        this.success = 'Recurso actualizado correctamente.';
      } else {
        await this.recursoService.crearRecurso(recursoData);
        this.success = 'Recurso creado correctamente.';
      }

      await this.cargarRecursos();
      this.cerrarFormulario();
    } catch (error) {
      console.error('Error al guardar recurso:', error);
      this.error = error instanceof Error ? error.message : 'Error al guardar el recurso. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }

  async confirmarEliminar(recurso: Recurso) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el recurso "${recurso.nombre}"?`)) {
      return;
    }

    this.cargando = true;
    this.error = null;
    this.success = null;

    try {
      await this.recursoService.eliminarRecurso(recurso.id);
      this.success = 'Recurso eliminado correctamente.';
      await this.cargarRecursos();
    } catch (error) {
      console.error('Error al eliminar recurso:', error);
      this.error = error instanceof Error ? error.message : 'Error al eliminar el recurso. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }
}
