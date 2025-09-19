import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SavedDesignsPageComponent } from './saved-designs-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SavedDesignsPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    SharedModule
  ],
  exports: [
    SavedDesignsPageComponent
  ]
})
export class SavedDesignsPageModule { }