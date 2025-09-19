import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatFormField } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  imports: [MatFormField, CommonModule, MatButtonModule, MatInputModule],
})
export class VerifyEmailComponent {
  email = this.route.snapshot.queryParamMap.get('email') ?? '';
  loading = false;
  sent = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async resend(emailInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    this.loading = true;
    this.error = '';
    try {
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const cred = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      await cred.user?.sendEmailVerification({
        url: `${window.location.origin}/verified`,
      });
      await this.afAuth.signOut();
      this.sent = true;
    } catch (e: any) {
      this.error = e?.code ?? 'auth/error';
    } finally {
      this.loading = false;
    }
  }

  async alreadyVerified() {
    this.loading = true;
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          this.router.navigate(['/designs']);
          return;
        }
      }

      this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }
}
