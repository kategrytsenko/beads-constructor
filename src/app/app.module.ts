import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupModule } from './core/auth/signup/signup.module';
import { LoginModule } from './core/auth/login/login.module';
import { BeadsConstructorModule } from './constructor-page/components/beads-constructor/beads-constructor.module';
import { PaintingPanelModule } from './constructor-page/components/painting-panel/painting-panel.module';
import { SavedDesignsPageModule } from './saved-designs-page/saved-designs-page.module';
import { ConstructorPageModule } from './constructor-page/constructor-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './core/auth/auth.service';
import { HeaderModule } from './core/header/header.module';
import { MotivateLoginPopupModule } from './constructor-page/components/motivate-login-popup/motivate-login-popup.module';
import { ConstructorService } from './services/constructor.service';
import { ColorsService } from './services/colors.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    FormsModule,
    // CommonModule,
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSnackBarModule,

    SignupModule,
    LoginModule,
    BeadsConstructorModule,
    PaintingPanelModule,
    SavedDesignsPageModule,
    ConstructorPageModule,
    HeaderModule,
    MotivateLoginPopupModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(), // offline cashe
    AngularFireStorageModule, // Storage preview
  ],
  providers: [AuthService, ConstructorService, ColorsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
