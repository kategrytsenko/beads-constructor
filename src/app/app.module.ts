import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

// Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Auth Modules
import { SignupModule } from './core/auth/signup/signup.module';
import { LoginModule } from './core/auth/login/login.module';

// Page Modules
import { SavedDesignsPageModule } from './saved-designs-page/saved-designs-page.module';
import { ConstructorPageModule } from './constructor-page/constructor-page.module';
import { HeaderModule } from './core/header/header.module';
import { MotivateLoginPopupModule } from './constructor-page/components/motivate-login-popup/motivate-login-popup.module';

// Shared Modules
import { SharedModule } from './shared/shared.module';

// Services
import { AuthService } from './core/auth/auth.service';
import { ConstructorService } from './services/constructor.service';
import { ColorsService } from './services/colors.service';
import { DesignService } from './services/design.service';
import { ProfilePageModule } from './profile-page/profile-page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,

    // Firebase
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,

    // Material
    MatSnackBarModule,
    MatProgressSpinnerModule,

    // Auth
    SignupModule,
    LoginModule,

    // Pages
    SavedDesignsPageModule,
    ConstructorPageModule, // Містить BeadsConstructorModule та PaintingPanelModule
    HeaderModule,
    MotivateLoginPopupModule,
    ProfilePageModule,

    // Shared modules
    SharedModule,
  ],
  providers: [AuthService, ConstructorService, ColorsService, DesignService],
  bootstrap: [AppComponent],
})
export class AppModule {}
