import { NgModule } from '@angular/core';
import { ConstructorPageComponent } from './constructor-page.component';
import { PaintingPanelModule } from './components/painting-panel/painting-panel.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BeadsConstructorModule } from './components/beads-constructor/beads-constructor.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConstructorPageComponent],
  imports: [
    PaintingPanelModule,
    BeadsConstructorModule,

    FormsModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,

    MatButtonModule,
  ],
  providers: [],
})
export class ConstructorPageModule {}
