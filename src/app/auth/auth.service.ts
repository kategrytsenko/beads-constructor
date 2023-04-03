import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// @Injectable()
export class AuthService {
  authChange$$ = new Subject<boolean>();
  private user!: User | null;

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), //TODO: backend
    };

    this.authChange$$.next(true);
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), //TODO: backend
    };

    this.authChange$$.next(true);
  }

  logout(authData: AuthData) {
    this.user = null;

    this.authChange$$.next(false);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user !== null;
  }
}
