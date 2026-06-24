import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { UsuarioService } from '../services/usuario.service';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // En desarrollo (sin Supabase), permitir acceso
  if (!supabaseService.isReady()) {
    return true;
  }

  try {
    const session = await supabaseService.getSession();

    if (session) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('Error en AuthGuard:', error);
    // En desarrollo, permitir acceso
    return true;
  }
};

export const AdminGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const usuarioService = inject(UsuarioService);

  if (!supabaseService.isReady()) {
    return true;
  }

  try {
    const session = await supabaseService.getSession();

    if (!session) {
      router.navigate(['/login']);
      return false;
    }

    const usuario = await firstValueFrom(usuarioService.getUsuarioActual());
    if (usuario?.rol === 'admin') {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  } catch (error) {
    console.error('Error en AdminGuard:', error);
    return true;
  }
};
