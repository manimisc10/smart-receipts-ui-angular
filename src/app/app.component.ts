import { Component, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Smart Receipts';
  isLoggedIn = false;
  isLandingPage = false;
  isMobile = false;
  currentPageTitle = '';
  // Sidenav removed; keep reference optional for legacy checks
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated$.subscribe(
      isAuth => this.isLoggedIn = isAuth
    );

    // Track current route to determine if we're on landing page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLandingPage = event.url === '/landing' || event.url === '/' || event.url === '' || 
                          event.url === '/login' || event.url === '/register';
    });

    // Check initial screen size and set appropriate default state
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    // No sidebar behavior anymore
  }

  closeSidenavOnMobile() {
    // Only auto-close the sidebar on mobile after navigation
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
    // On desktop, keep the sidebar open after navigation for better UX
  }

  logout() {
    this.authService.logout();
  }

  clearData() {
    this.authService.clearAllData();
    console.log('Debug: All data cleared');
  }

  setCurrentPageTitle(title: string) {
    this.currentPageTitle = title;
  }

  // Removed resizer handlers
}
