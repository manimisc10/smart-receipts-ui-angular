import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { signIn, signOut, signUp, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

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
    // Hydrate from Amplify session in the background
    this.hydrateFromAmplify();
  }

  login(credentials: LoginRequest): Observable<User> {
    return from(this.handleSignIn(credentials.email, credentials.password));
  }

  register(userData: RegisterRequest): Observable<User> {
    return from(this.handleSignUp(userData));
  }

  async logout(): Promise<void> {
    try {
      await signOut();
    } catch {}
    this.currentUserSubject.next(null);
    await this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Debug method to clear all stored data
  clearAllData(): void {
    this.currentUserSubject.next(null);
    console.log('All auth data cleared');
  }

  private async hydrateFromAmplify(): Promise<void> {
    try {
      const current = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (current && idToken) {
        const user: User = {
          id: current.userId,
          email: current.signInDetails?.loginId ?? '',
          name: '',
          token: idToken
        };
        this.currentUserSubject.next(user);
      }
    } catch {
      // No active session; ignore
    }
  }

  private async handleSignIn(email: string, password: string): Promise<User> {
    try {
      const res = await signIn({ username: email, password });
      if (!res.isSignedIn) {
        // Handle next steps (MFA, confirm sign up, etc.) as errors for now
        const step = res.nextStep?.signInStep;
        if (step === 'CONFIRM_SIGN_UP') {
          throw { code: 'CONFIRM_SIGN_UP', message: 'Please confirm your email before signing in.' };
        }
        throw { code: 'SIGN_IN_CHALLENGE', message: 'Additional sign-in challenge required.' };
      }

      const current = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const nameFromToken = (session as any)?.tokens?.idToken?.payload?.name ?? '';

      if (!idToken) {
        throw { code: 'NO_TOKEN', message: 'Unable to retrieve token from session.' };
      }

      const user: User = {
        id: current.userId,
        email: current.signInDetails?.loginId ?? email,
        name: nameFromToken || email,
        token: idToken
      };
      this.currentUserSubject.next(user);
      return user;
    } catch (error: any) {
      const message = error?.message || 'Login failed';
      throw message;
    }
  }

  private async handleSignUp(userData: RegisterRequest): Promise<User> {
    try {
      const res = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            name: userData.name
          },
          autoSignIn: true
        }
      });

      if (!res.isSignUpComplete && res.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        // Bubble up a controlled error to inform UI to redirect to login
        throw { code: 'CONFIRM_SIGN_UP', message: 'Confirmation email sent. Please verify your account.' };
      }

      // If sign-up is complete, try to sign-in immediately
      return await this.handleSignIn(userData.email, userData.password);
    } catch (error: any) {
      // If it's our controlled error, rethrow message; otherwise forward Amplify message
      if (error?.code === 'CONFIRM_SIGN_UP') {
        throw error.message;
      }
      throw (error?.message || 'Registration failed');
    }
  }

  // New: session-based auth check for guards
  async checkSession(): Promise<boolean> {
    try {
      await getCurrentUser();
      const session = await fetchAuthSession();
      return !!session.tokens?.idToken;
    } catch {
      return false;
    }
  }
}
