import { AuthData, AuthResult } from './auth-data.model';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  authChange$$ = new BehaviorSubject<boolean>(false);
  user$ = this.afAuth.authState;

  private readonly ERROR_MESSAGES: Record<string, string> = {
    'auth/email-already-in-use': 'E-mail вже використовується',
    'auth/invalid-email': 'Некоректний e-mail',
    'auth/weak-password': 'Надто слабкий пароль (мін. 6 символів)',
    'auth/user-not-found': 'Користувача не знайдено',
    'auth/wrong-password': 'Невірний пароль',
    'auth/invalid-credential': 'Невірні облікові дані',
    'auth/too-many-requests': 'Занадто багато спроб. Спробуйте пізніше',
    'auth/network-request-failed':
      'Помилка мережі. Перевірте підключення до інтернету',
    default: 'Помилка авторизації. Спробуйте пізніше',
  };

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
        this.showSuccess('Реєстрацію завершено! Перевірте електронну пошту');

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
        this.showWarning('Підтвердіть електронну пошту для входу');
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
      this.showError("Пароль обов'язковий для повторного відправлення листа");
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
        this.showSuccess('Лист для підтвердження відправлено');
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
      this.showSuccess('Ви успішно вийшли з системи');
    } catch (error) {
      console.error('Logout error:', error);
      this.showError('Помилка при виході з системи');
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
    this.showSuccess('Успішний вхід в систему!');
  }

  private handleAuthError(error: any): string {
    console.error('Auth error:', error);

    const errorCode = error?.code || 'default';
    const message =
      this.ERROR_MESSAGES[errorCode] || this.ERROR_MESSAGES['default'];

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
