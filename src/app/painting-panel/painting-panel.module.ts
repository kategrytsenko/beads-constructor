import { NgModule } from '@angular/core';
import { PaintingPanelComponent } from './painting-panel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PaintingPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [PaintingPanelComponent],
})
export class PaintingPanelModule {}
