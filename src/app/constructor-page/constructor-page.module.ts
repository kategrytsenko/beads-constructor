import { NgModule } from '@angular/core';
import { ConstructorPageComponent } from './constructor-page.component';
import { PaintingPanelModule } from '../painting-panel/painting-panel.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BeadsConstructorModule } from '../beads-constructor/beads-constructor.module';

@NgModule({
  declarations: [ConstructorPageComponent],
  imports: [
    PaintingPanelModule,
    BeadsConstructorModule,

    FormsModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,
  ],
  providers: [],
})
export class ConstructorPageModule {}
