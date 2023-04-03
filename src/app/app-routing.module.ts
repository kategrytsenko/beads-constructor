import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ConstructorPageComponent } from './constructor-page/constructor-page.component';
import { SavedDesignsPageComponent } from './saved-designs-page/saved-designs-page.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'constructor',
    component: ConstructorPageComponent
  },
  {
    path: 'designs',
    component: SavedDesignsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
