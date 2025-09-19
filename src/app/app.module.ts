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

// Auth Modules
import { SignupModule } from './core/auth/signup/signup.module';
import { LoginModule } from './core/auth/login/login.module';

// Page Modules
import { BeadsConstructorModule } from './constructor-page/components/beads-constructor/beads-constructor.module';
import { PaintingPanelModule } from './constructor-page/components/painting-panel/painting-panel.module';
import { SavedDesignsPageModule } from './saved-designs-page/saved-designs-page.module';
import { ConstructorPageModule } from './constructor-page/constructor-page.module';
import { HeaderModule } from './core/header/header.module';
import { MotivateLoginPopupModule } from './constructor-page/components/motivate-login-popup/motivate-login-popup.module';

// New Modules
import { SharedModule } from './shared/shared.module';
import { SaveDesignDialogModule } from './constructor-page/components/save-design-dialog/save-design-dialog.module';

// Services
import { AuthService } from './core/auth/auth.service';
import { ConstructorService } from './services/constructor.service';
import { ColorsService } from './services/colors.service';
import { DesignService } from './services/design.service';

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
    
    // Auth
    SignupModule,
    LoginModule,
    
    // Pages
    BeadsConstructorModule,
    PaintingPanelModule,
    SavedDesignsPageModule,
    ConstructorPageModule,
    HeaderModule,
    MotivateLoginPopupModule,
    
    // New modules
    SharedModule,
    SaveDesignDialogModule
  ],
  providers: [
    AuthService, 
    ConstructorService, 
    ColorsService,
    DesignService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}