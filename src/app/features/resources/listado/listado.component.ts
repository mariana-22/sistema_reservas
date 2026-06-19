import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Recurso } from '../../../core/models';
import { RecursoService } from '../../../core/services/recurso.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-listado-recursos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit, OnDestroy {
  recursos: Recurso[] = [];
  recursosFiltrados: Recurso[] = [];
  cargando = false;
  error: string | null = null;
  filtro = '';
  private destroy$ = new Subject<void>();

  constructor(private recursoService: RecursoService) {}

  ngOnInit(): void {
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
    if (!this.filtro.trim()) {
      this.recursosFiltrados = [...this.recursos];
      return;
    }

    try {
      this.recursosFiltrados = await this.recursoService.buscarRecursos(this.filtro);
    } catch (error) {
      console.error('Error al buscar recursos:', error);
      this.recursosFiltrados = this.recursos.filter(r =>
        r.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }
  }
}
