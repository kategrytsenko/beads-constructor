import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './core/auth/signup/signup.component';
import { ConstructorPageComponent } from './constructor-page/constructor-page.component';
import { SavedDesignsPageComponent } from './saved-designs-page/saved-designs-page.component';
import { LoginComponent } from './core/auth/login/login.component';
import { AuthGuard } from './core/auth/auth.guard';
import { EmailVerifiedGuard } from './core/auth/email-verified.guard';
import { ProfilePageComponent } from './profile-page/profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: ConstructorPageComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'designs',
    component: SavedDesignsPageComponent,
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./core/auth/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent
      ),
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [EmailVerifiedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, EmailVerifiedGuard],
})
export class AppRoutingModule {}
