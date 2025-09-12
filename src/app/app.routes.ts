import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/public/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [publicGuard]
  },
  { 
    path: 'landing', 
    loadComponent: () => import('./pages/public/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [publicGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/public/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/public/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/private/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'scan', 
    loadComponent: () => import('./pages/private/scan/scan.component').then(m => m.ScanComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'receipt/:id', 
    loadComponent: () => import('./pages/private/receipt-details/receipt-details.component').then(m => m.ReceiptDetailsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'history', 
    loadComponent: () => import('./pages/private/history/history.component').then(m => m.HistoryComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'analytics', 
    loadComponent: () => import('./pages/private/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/private/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/' }
];
