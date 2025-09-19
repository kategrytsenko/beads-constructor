import { AuthData, AuthResult } from './auth-data.model';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ERROR_MESSAGES, UI_MESSAGES } from './constants/auth-messages.const';

@Injectable()
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  authChange$$ = new BehaviorSubject<boolean>(false);
  user$ = this.afAuth.authState;

  private readonly VERIFICATION_CONFIG = {
    url: `${window.location.origin}/verified`,
    handleCodeInApp: false,
  };

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.afAuth.authState.subscribe((user) => {
      const isAuthenticated = !!user?.emailVerified;
      this.authChange$$.next(isAuthenticated);
    });

    this.afAuth.setPersistence('local').catch((error) => {
      console.error('Failed to set persistence:', error);
    });
  }

  async registerUser({ email, password }: AuthData): Promise<AuthResult> {
    try {
      const cred = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (cred.user) {
        await cred.user.sendEmailVerification(this.VERIFICATION_CONFIG);
        await this.afAuth.signOut();

        this.router.navigate(['/verify-email'], { queryParams: { email } });
        this.showSuccess(UI_MESSAGES.registrationCompleted);

        return { success: true };
      }

      throw new Error('User creation failed');
    } catch (error: any) {
      const errorMessage = this.handleAuthError(error);
      return { success: false, error: errorMessage };
    }
  }

  async login({ email, password }: AuthData): Promise<AuthResult> {
    try {
      const cred = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (!cred.user?.emailVerified) {
        await this.afAuth.signOut();
        this.router.navigate(['/verify-email'], { queryParams: { email } });
        this.showWarning(UI_MESSAGES.verifyEmailToSignIn);
        return { success: false, error: 'Email not verified' };
      }

      this.authSuccessfully();
      return { success: true };
    } catch (error: any) {
      const errorMessage = this.handleAuthError(error);
      return { success: false, error: errorMessage };
    }
  }

  async sendVerificationTo(
    email: string,
    password?: string
  ): Promise<AuthResult> {
    if (!password) {
      this.showError(UI_MESSAGES.passwordRequiredForResend);
      return { success: false, error: 'Password required' };
    }

    try {
      const cred = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (cred.user) {
        await cred.user.sendEmailVerification(this.VERIFICATION_CONFIG);
        await this.afAuth.signOut();
        this.showSuccess(UI_MESSAGES.verificationEmailSent);
        return { success: true };
      }

      throw new Error('Failed to send verification email');
    } catch (error: any) {
      const errorMessage = this.handleAuthError(error);
      return { success: false, error: errorMessage };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.authChange$$.next(false);
      this.router.navigate(['/login']);
      this.showSuccess(UI_MESSAGES.signedOutSuccess);
    } catch (error) {
      console.error('Logout error:', error);
      this.showError(UI_MESSAGES.signOutError);
    }
  }

  async getUserOnce() {
    try {
      return await firstValueFrom(this.user$);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  isAuth(): boolean {
    return this.authChange$$.value;
  }

  private authSuccessfully(): void {
    this.authChange$$.next(true);
    this.router.navigate(['/designs']);
    this.showSuccess(UI_MESSAGES.signedInSuccess);
  }

  private handleAuthError(error: any): string {
    console.error('Auth error:', error);

    const errorCode = error?.code || 'default';
    const message = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES['default'];

    this.showError(message);
    return message;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  private showWarning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 7000,
      panelClass: ['warning-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 8000,
      panelClass: ['error-snackbar'],
    });
  }
}
