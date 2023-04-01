import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PaintBlockComponent } from './paint-block.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PaintBlockComponent],
  imports: [BrowserModule, FormsModule],
  exports: [PaintBlockComponent],
})
export class PaintBlockModule {}
