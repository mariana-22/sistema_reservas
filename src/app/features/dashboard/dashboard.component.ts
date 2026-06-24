import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HorarioService } from '../../core/services/horario.service';
import { Horario } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalHorarios = 0;
  horariosRecientes: Horario[] = [];

  constructor(private horarioService: HorarioService) {}

  async ngOnInit() {
    try {
      const horarios = await this.horarioService.obtenerTodos();
      this.totalHorarios = horarios.length;
      this.horariosRecientes = horarios.slice(0, 3);
    } catch (error) {
      console.error('Error al cargar horarios en el dashboard:', error);
    }
  }
}
