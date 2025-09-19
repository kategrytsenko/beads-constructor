import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';
import { map, take } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.auth.user$.pipe(
      take(1),
      map(user => user ? true : this.router.createUrlTree(['/login']))
    );
  }
}