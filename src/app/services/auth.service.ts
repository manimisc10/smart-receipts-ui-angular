import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUserSubject.asObservable().pipe(
    map((user: User | null) => !!user)
  );

  constructor(private router: Router) {
    // Check for stored user on app start
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Validate user object structure
        if (user && user.id && user.email && user.token) {
          this.currentUserSubject.next(user);
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('currentUser');
        }
      }
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('currentUser');
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
          const user: User = {
            id: '1',
            email: credentials.email,
            name: 'Demo User',
            token: 'mock-jwt-token'
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next(user);
          observer.complete();
        } else {
          observer.error('Invalid credentials');
        }
      }, 1000);
    });
  }

  register(userData: RegisterRequest): Observable<User> {
    return new Observable(observer => {
      // Simulate API call
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          token: 'mock-jwt-token'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/landing']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Debug method to clear all stored data
  clearAllData(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('All auth data cleared');
  }
}
