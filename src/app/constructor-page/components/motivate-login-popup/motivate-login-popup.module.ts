import { NgModule } from '@angular/core';
import { MotivateLoginPopupComponent } from './motivate-login-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MotivateLoginPopupComponent],
  imports: [MatDialogModule, MatButtonModule],
  providers: [],
})
export class MotivateLoginPopupModule {}
