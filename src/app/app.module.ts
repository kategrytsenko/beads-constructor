import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupModule } from './auth/signup/signup.module';
import { LoginModule } from './auth/login/login.module';
import { BeadsConstructorModule } from './beads-constructor/beads-constructor.module';
import { PaintingPanelModule } from './painting-panel/painting-panel.module';
import { SavedDesignsPageModule } from './saved-designs-page/saved-designs-page.module';
import { ConstructorPageModule } from './constructor-page/constructor-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth/auth.service';
import { HeaderModule } from './header/header.module';
import { MotivateLoginPopupModule } from './motivate-login-popup/motivate-login-popup.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    FormsModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,

    SignupModule,
    LoginModule,
    BeadsConstructorModule,
    PaintingPanelModule,
    SavedDesignsPageModule,
    ConstructorPageModule,
    HeaderModule,
    MotivateLoginPopupModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
