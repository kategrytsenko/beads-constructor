import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  authChange$$ = new BehaviorSubject<boolean>(false);
  private user!: User | null;

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), //TODO: backend
    };

    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString(), //TODO: backend
    };

    this.authSuccessfully();
  }

  logout() {
    this.user = null;

    this.authChange$$.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }

  private authSuccessfully() {
    this.authChange$$.next(true);
    this.router.navigate(['/designs']);
  }
}
