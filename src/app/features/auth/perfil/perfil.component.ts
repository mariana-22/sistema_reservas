import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  usuario$: Observable<Usuario | null>;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private usuarioService: UsuarioService
  ) {
    this.usuario$ = this.usuarioService.getUsuarioActual();
  }

  async cerrarSesion() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
