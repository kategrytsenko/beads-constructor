import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaintBlockModule } from './paint-block/paint-block.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupModule } from './auth/signup/signup.module';
import { LoginModule } from './auth/login/login.module';
import { WelcomePageModule } from './welcome-page/welcome-page.module';
import { BeadsConstructorModule } from './beads-constructor/beads-constructor.module';
import { BeadsConstructorItemModule } from './beads-constructor-item/beads-constructor-item.module';
import { PaintingPanelModule } from './painting-panel/painting-panel.module';
import { SavedDesignsPageModule } from './saved-designs-page/saved-designs-page.module';
import { ConstructorPageModule } from './constructor-page/constructor-page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    PaintBlockModule,
    FormsModule,
    CommonModule,
    NgbModule,

    SignupModule,
    LoginModule,
    WelcomePageModule,
    BeadsConstructorItemModule,
    BeadsConstructorModule,
    PaintingPanelModule,
    SavedDesignsPageModule,
    ConstructorPageModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
