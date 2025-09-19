import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PasswordInputComponent } from './components/password-input/password-input.component';

@NgModule({
  declarations: [ConfirmDialogComponent, PasswordInputComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    ConfirmDialogComponent,
    PasswordInputComponent,
    // Re-export commonly used Material modules
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class SharedModule {}
