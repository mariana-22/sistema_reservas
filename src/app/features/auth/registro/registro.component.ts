import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  registroForm!: FormGroup;
  cargando = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService,
    private usuarioService: UsuarioService
  ) {
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    this.registroForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  async enviar() {
    if (this.cargando) {
      return;
    }

    if (this.registroForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.error = null;

    try {
      const { email, password, nombre, apellido, telefono } = this.registroForm.value;

      // Registrar usuario en Supabase Auth
      const userData = {
        nombre,
        apellido,
        telefono,
        rol: 'usuario'
      };

      const { user, session } = await this.supabaseService.signUp(email, password, userData) as any;
      if (user?.id && session) {
        await this.usuarioService.crearUsuario({
          id: user.id,
          email,
          nombre,
          apellido,
          telefono: telefono || undefined,
          rol: 'usuario'
        });
        await this.supabaseService.signOut();
      }

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en registro:', error);
      this.usuarioService.clearUsuarioActual();
      this.error = this.getErrorMessage(error);
    } finally {
      this.cargando = false;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (!error) {
      return 'Error al registrar. Por favor, intenta de nuevo.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null) {
      const anyError = error as Record<string, any>;
      if (
        anyError['message'] &&
        typeof anyError['message'] === 'string' &&
        anyError['message'].includes('security purposes')
      ) {
        return 'Por seguridad, espera unos segundos antes de intentar nuevamente.';
      }
      return anyError['message'] || anyError['error_description'] || 'Error al registrar. Por favor, intenta de nuevo.';
    }

    return String(error);
  }
}
