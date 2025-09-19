import { AuthData } from './auth-data.model';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);

  authChange$$ = new BehaviorSubject<boolean>(false);
  user$ = this.afAuth.authState;

  constructor() {
    this.afAuth.authState.subscribe((u) =>
      this.authChange$$.next(!!u && !!u.emailVerified)
    );
    this.afAuth.setPersistence('local');
  }

  async registerUser({ email, password }: AuthData) {
    const cred = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = cred.user;
    if (user) {
      await user.sendEmailVerification({
        url: `${window.location.origin}/verified`,
        handleCodeInApp: false,
      });
    }
    await this.afAuth.signOut(); 
    this.router.navigate(['/verify-email'], { queryParams: { email } });
  }

  async login({ email, password }: AuthData) {
    const cred = await this.afAuth.signInWithEmailAndPassword(email, password);
    if (!cred.user?.emailVerified) {
      await this.afAuth.signOut();
      this.router.navigate(['/verify-email'], { queryParams: { email } });
      return;
    }
    this.router.navigate(['/designs']);
  }

  async sendVerificationTo(email: string, password?: string) {
    const cred = await this.afAuth.signInWithEmailAndPassword(
      email,
      password ?? ''
    );
    if (cred.user)
      await cred.user.sendEmailVerification({
        url: `${window.location.origin}/verified`,
      });
    await this.afAuth.signOut();
  }

  async logout() {
    await this.afAuth.signOut();
    this.authChange$$.next(false);
    this.router.navigate(['/login']);
  }

  async getUserOnce() {
    return await firstValueFrom(this.user$); // Firebase user || null
  }

  isAuth() {
    return this.authChange$$.value;
  }

  private authSuccessfully() {
    this.authChange$$.next(true);
    this.router.navigate(['/designs']);
  }

  private handleAuthError(e: any) {
    // TODO: add custom UI (snackbar / alert)
    const code = e?.code as string;
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'E-mail вже використовується',
      'auth/invalid-email': 'Некоректний e-mail',
      'auth/weak-password': 'Надто слабкий пароль (мін. 6 символів)',
      'auth/user-not-found': 'Користувача не знайдено',
      'auth/wrong-password': 'Невірний пароль',
    };
    alert(map[code] ?? 'Помилка авторизації');
  }
}
