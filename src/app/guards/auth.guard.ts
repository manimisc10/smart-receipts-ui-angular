import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const ok = await authService.checkSession();
  if (ok) return true;

  router.navigate(['/login']);
  return false;
};
