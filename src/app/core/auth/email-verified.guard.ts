import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmailVerifiedGuard implements CanActivate {
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);

  canActivate() {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user?.emailVerified) return true;
        this.router.navigate(['/verify-email'], {
          queryParams: { email: user?.email ?? '' },
        });
        return false;
      })
    );
  }
}
