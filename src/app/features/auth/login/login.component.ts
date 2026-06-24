import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
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

  ngOnInit(): void {
    this.verificarSesion();
  }

  private async verificarSesion() {
    try {
      const session = await this.supabaseService.getSession();
      if (session) {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    }
  }

  private inicializarFormulario() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async enviar() {
    if (this.loginForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.error = null;

    try {
      const { email, password } = this.loginForm.value;
      const { user } = await this.supabaseService.signIn(email, password) as any;
      if (user?.id) {
        await this.usuarioService.crearUsuarioSiNoExiste(user);
      }
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error en login:', error);
      this.error = 'Credenciales inválidas. Por favor, intenta de nuevo.';
    } finally {
      this.cargando = false;
    }
  }
}
