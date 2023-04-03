import { NgModule } from '@angular/core';
import { WelcomePageComponent } from './welcome-page.component';
import { CommonModule } from '@angular/common';
import { PaintingPanelModule } from '../painting-panel/painting-panel.module';

@NgModule({
  declarations: [WelcomePageComponent],
  imports: [CommonModule, PaintingPanelModule],
  providers: [],
})
export class WelcomePageModule {}
