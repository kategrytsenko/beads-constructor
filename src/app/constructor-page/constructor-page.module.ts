import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; 

// Angular Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Components
import { ConstructorPageComponent } from './constructor-page.component';

// Shared modules
import { SharedModule } from '../shared/shared.module';
import { SaveDesignDialogModule } from './components/save-design-dialog/save-design-dialog.module';
import { BeadsConstructorModule } from './components/beads-constructor/beads-constructor.module';
import { PaintingPanelModule } from './components/painting-panel/painting-panel.module';
import { CanvasLimitsService } from '../services/canvas-limits.service';

@NgModule({
  declarations: [ConstructorPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FlexLayoutModule,

    // Material modules
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonToggleModule,

    // Custom modules
    SharedModule,
    SaveDesignDialogModule,
    BeadsConstructorModule, // ДОДАНО
    PaintingPanelModule, // ДОДАНО
  ],
  exports: [ConstructorPageComponent],
  providers: [CanvasLimitsService],
})
export class ConstructorPageModule {}
