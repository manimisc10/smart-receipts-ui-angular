import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const publicGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const ok = await authService.checkSession();
  if (!ok) return true;

  // User is authenticated, redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};
