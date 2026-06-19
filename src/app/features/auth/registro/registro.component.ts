import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

      await this.supabaseService.signUp(email, password, userData);

      // Crear registro en tabla usuarios
      await this.usuarioService.crearUsuario({
        email,
        nombre,
        apellido,
        telefono: telefono || undefined,
        rol: 'usuario'
      });

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en registro:', error);
      this.error = 'Error al registrar. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }
}
