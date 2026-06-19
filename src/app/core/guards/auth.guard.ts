import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const AuthGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

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
    router.navigate(['/login']);
    return false;
  }
};

export const AdminGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  try {
    const session = await supabaseService.getSession();

    if (session) {
      const user = await supabaseService.getCurrentUser();
      // TODO: Validar rol de usuario en BD
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('Error en AdminGuard:', error);
    router.navigate(['/login']);
    return false;
  }
};
