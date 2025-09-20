import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConstructorConfig,
  PaintBlockModel,
} from '../models/constructor.model';
import { AuthService } from '../core/auth/auth.service';
import { DesignService } from '../services/design.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { MotivateLoginPopupComponent } from './components/motivate-login-popup/motivate-login-popup.component';
import {
  SaveDesignDialogComponent,
  SaveDesignDialogData,
  SaveDesignDialogResult,
} from './components/save-design-dialog/save-design-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstructorService } from '../services/constructor.service';
import { ColorsService } from '../services/colors.service';
import { CreateDesignRequest, BeadDesign } from '../models/design.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { CanvasLimitsService } from '../services/canvas-limits.service';

@Component({
  selector: 'app-constructor-page',
  templateUrl: './constructor-page.component.html',
  styleUrls: ['./constructor-page.component.scss'],
})
export class ConstructorPageComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  isAuth = false;
  constructorConfig!: ConstructorConfig;
  rawBeadsAmount: number = this.constructorService.rawBeadsAmount;
  columnBeadsAmount: number = this.constructorService.columnBeadsAmount;
  selectedColor = '#ffffff';
  savedColors: string[] = this.colorsService.getColors();

  canvasLimits = this.canvasLimitsService.getLimitsForUser(false); // TODO: передавати isPremium з профілю
  validationErrors: string[] = [];
  validationWarnings: string[] = [];
  showLimitsInfo = false;

  // State for saving functionality
  currentDesignId: string | null = null;
  isLoadingDesign = false;
  isSaving = false;
  hasUnsavedChanges = false;

  constructor(
    private authService: AuthService,
    private designService: DesignService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private constructorService: ConstructorService,
    private colorsService: ColorsService,
    private snackBar: MatSnackBar,
    private canvasLimitsService: CanvasLimitsService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange$$.subscribe(
      (authStatus: boolean) => {
        this.isAuth = authStatus;
      }
    );

    this.constructorConfig = this.constructorService.getConstructorConfig();

    // Check if we need to load an existing design
    this.checkForDesignId();

    this.validateCanvasSize();
  }

  // Валідація розмірів canvas
  validateCanvasSize(): void {
    const validation = this.canvasLimitsService.validateCanvasSize(
      this.columnBeadsAmount,
      this.rawBeadsAmount,
      false // TODO: отримувати з профілю користувача
    );

    this.validationErrors = validation.errors;
    this.validationWarnings = validation.warnings;
  }

  // Викликається при зміні розмірів
  onCanvasSizeChange(): void {
    this.validateCanvasSize();
  }

  constrainCanvasSize(): void {
    const constrained = this.canvasLimitsService.constrainToLimits(
      this.columnBeadsAmount,
      this.rawBeadsAmount,
      false // TODO: isPremium
    );

    if (constrained.wasConstrained) {
      this.columnBeadsAmount = constrained.rows;
      this.rawBeadsAmount = constrained.columns;
      this.validateCanvasSize();
      this.showSuccess(
        `Canvas size adjusted to fit limits: ${constrained.rows}×${constrained.columns}`
      );
    }
  }

  // Оновлений метод зміни розмірів
  setNewDimensions() {
    const validation = this.canvasLimitsService.validateCanvasSize(
      this.columnBeadsAmount,
      this.rawBeadsAmount,
      false
    );

    if (!validation.isValid) {
      // Показуємо діалог з помилками
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Invalid Canvas Size',
          message: `Cannot apply these dimensions:\n\n${validation.errors.join(
            '\n'
          )}\n\nWould you like to automatically adjust to valid size?`,
          confirmText: 'Auto-adjust',
          cancelText: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.constrainCanvasSize();
          this.performDimensionChange();
        }
      });
      return;
    }

    // Показуємо попередження, якщо є
    if (validation.warnings.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Performance Warning',
          message: `${validation.warnings.join(
            '\n'
          )}\n\nDo you want to continue?`,
          confirmText: 'Continue',
          cancelText: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.performDimensionChange();
        }
      });
      return;
    }

    // Стандартна перевірка контенту
    const hasContent = this.constructorConfig.canvasArray.some((row) =>
      row.some((block) => block.color !== '#ffffff')
    );

    if (hasContent) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Change Canvas Size?',
          message:
            'Changing the canvas size will result in losing the current design. Continue?',
          confirmText: 'Change',
          cancelText: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.performDimensionChange();
        }
      });
    } else {
      this.performDimensionChange();
    }
  }

  // Показати інформацію про ліміти
  toggleLimitsInfo(): void {
    this.showLimitsInfo = !this.showLimitsInfo;
  }

  // Встановити рекомендований розмір
  setRecommendedSize(rows: number, columns: number): void {
    this.columnBeadsAmount = rows;
    this.rawBeadsAmount = columns;
    this.validateCanvasSize();
  }

  // Отримати рекомендовані розміри
  get recommendedSizes() {
    return this.canvasLimitsService.getRecommendedSizes(false); // TODO: isPremium
  }

  // Перевірка, чи розміри валідні для кнопки Apply
  get canApplyDimensions(): boolean {
    const validation = this.canvasLimitsService.validateCanvasSize(
      this.columnBeadsAmount,
      this.rawBeadsAmount,
      false
    );
    return validation.isValid;
  }

  // Отримати попередження про продуктивність
  get performanceWarning(): string | null {
    return this.canvasLimitsService.getPerformanceWarning(
      this.columnBeadsAmount,
      this.rawBeadsAmount
    );
  }

  private checkForDesignId(): void {
    const designId = this.route.snapshot.queryParams['designId'];
    if (designId && this.isAuth) {
      this.loadDesign(designId);
    }
  }

  private async loadDesign(designId: string): Promise<void> {
    this.isLoadingDesign = true;

    this.designService.getDesignById(designId).subscribe({
      next: (design: BeadDesign | null) => {
        if (design) {
          this.currentDesignId = design.id!;
          this.rawBeadsAmount = design.dimensions.rows;
          this.columnBeadsAmount = design.dimensions.columns;

          // First create new canvas with correct dimensions
          this.constructorConfig =
            this.constructorService.resetConstructorConfig(
              this.rawBeadsAmount,
              this.columnBeadsAmount
            );

          // Then apply saved data to each cell
          this.applyDesignDataToCanvas(design.canvasData);
          this.hasUnsavedChanges = false;

          this.showSuccess(`Design "${design.name}" loaded`);
        } else {
          this.showError('Design not found');
          this.router.navigate(['/'], { queryParams: {} });
        }
        this.isLoadingDesign = false;
      },
      error: () => {
        this.isLoadingDesign = false;
        this.showError('Error loading design');
        this.router.navigate(['/'], { queryParams: {} });
      },
    });
  }

  private applyDesignDataToCanvas(savedCanvasData: PaintBlockModel[][]): void {
    // Check if saved design dimensions match current canvas
    if (!savedCanvasData || savedCanvasData.length === 0) {
      return;
    }

    const savedRows = savedCanvasData.length;
    const savedCols = savedCanvasData[0]?.length || 0;
    const currentRows = this.constructorConfig.canvasArray.length;
    const currentCols = this.constructorConfig.canvasArray[0]?.length || 0;

    console.log(
      `Applying design: saved ${savedRows}x${savedCols}, current ${currentRows}x${currentCols}`
    );

    // Apply saved colors to current canvas
    for (let row = 0; row < Math.min(savedRows, currentRows); row++) {
      for (let col = 0; col < Math.min(savedCols, currentCols); col++) {
        if (savedCanvasData[row] && savedCanvasData[row][col]) {
          // Use constructor service for proper updating
          const paintBlock: PaintBlockModel = {
            ...this.constructorConfig.canvasArray[row][col],
            color: savedCanvasData[row][col].color,
          };

          // Apply change through service
          this.constructorConfig.canvasArray =
            this.constructorService.onColorChanged(
              paintBlock,
              savedCanvasData[row][col].color
            );
        }
      }
    }
  }

  setWhite() {
    this.selectedColor = '#ffffff';
  }

  saveColor() {
    this.savedColors = this.colorsService.saveColor(this.selectedColor);
  }

  deleteColor(color: string) {
    this.savedColors = this.colorsService.deleteColor(color);
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  clearAllCanvas() {
    const hasContent = this.constructorConfig.canvasArray.some((row) =>
      row.some((block) => block.color !== '#ffffff')
    );

    if (hasContent) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Clear Canvas?',
          message:
            'Are you sure you want to clear the entire canvas? This action cannot be undone.',
          confirmText: 'Clear',
          cancelText: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.performClearCanvas();
        }
      });
    } else {
      this.performClearCanvas();
    }
  }

  private performClearCanvas(): void {
    this.constructorConfig.canvasArray =
      this.constructorService.clearAllCanvas();
    this.hasUnsavedChanges = true;
  }

  // setNewDimensions() {
  //   const hasContent = this.constructorConfig.canvasArray.some((row) =>
  //     row.some((block) => block.color !== '#ffffff')
  //   );

  //   if (hasContent) {
  //     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //       data: {
  //         title: 'Change Canvas Size?',
  //         message:
  //           'Changing the canvas size will result in losing the current design. Continue?',
  //         confirmText: 'Change',
  //         cancelText: 'Cancel',
  //       },
  //     });

  //     dialogRef.afterClosed().subscribe((confirmed) => {
  //       if (confirmed) {
  //         this.performDimensionChange();
  //       }
  //     });
  //   } else {
  //     this.performDimensionChange();
  //   }
  // }

  private performDimensionChange(): void {
    this.clearAllCanvas();
    this.constructorConfig = this.constructorService.resetConstructorConfig(
      this.rawBeadsAmount,
      this.columnBeadsAmount
    );
    this.currentDesignId = null; // New canvas = new design
    this.hasUnsavedChanges = false;
  }

  onColorChanged(paintedBlock: PaintBlockModel | any) {
    // Type guard to ensure we have the right type
    if (
      paintedBlock &&
      typeof paintedBlock === 'object' &&
      'color' in paintedBlock
    ) {
      this.constructorConfig.canvasArray =
        this.constructorService.onColorChanged(
          paintedBlock as PaintBlockModel,
          this.selectedColor
        );
      this.hasUnsavedChanges = true;
    }
  }

  async onDesignSave() {
    if (!this.isAuth) {
      this.dialog.open(MotivateLoginPopupComponent);
      return;
    }

    // If updating existing design, load current data
    let currentDesignData: BeadDesign | null = null;
    if (this.currentDesignId) {
      try {
        // Get current design from database using firstValueFrom
        currentDesignData = await firstValueFrom(
          this.designService.getDesignById(this.currentDesignId).pipe(take(1))
        );
      } catch (error) {
        console.error('Error loading current design data:', error);
        currentDesignData = null;
      }
    }

    const dialogData: SaveDesignDialogData = {
      mode: this.currentDesignId ? 'update' : 'create',
      existingName: currentDesignData?.name || '',
      existingDescription: currentDesignData?.description || '',
    };

    const dialogRef = this.dialog.open(SaveDesignDialogComponent, {
      data: dialogData,
      disableClose: true,
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .subscribe(async (result: SaveDesignDialogResult | null) => {
        if (result) {
          await this.saveDesign(result);
        }
      });
  }

  private async saveDesign(
    dialogResult: SaveDesignDialogResult
  ): Promise<void> {
    this.isSaving = true;

    try {
      const designData: CreateDesignRequest = {
        name: dialogResult.name,
        description: dialogResult.description,
        canvasData: JSON.parse(
          JSON.stringify(this.constructorConfig.canvasArray)
        ), // deep copy
        dimensions: {
          rows: this.rawBeadsAmount,
          columns: this.columnBeadsAmount,
        },
      };

      if (this.currentDesignId) {
        // Update existing design
        const success = await this.designService.updateDesign({
          id: this.currentDesignId,
          ...designData,
        });

        if (success) {
          this.hasUnsavedChanges = false;
        }
      } else {
        // Create new design
        const newDesignId = await this.designService.createDesign(designData);

        if (newDesignId) {
          this.currentDesignId = newDesignId;
          this.hasUnsavedChanges = false;

          // Update URL with new ID
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { designId: newDesignId },
            queryParamsHandling: 'merge',
          });
        }
      }
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      this.isSaving = false;
    }
  }

  async onCreateNew(): Promise<void> {
    if (this.hasUnsavedChanges) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Unsaved Changes',
          message:
            'You have unsaved changes. Are you sure you want to create a new design?',
          confirmText: 'Create New',
          cancelText: 'Cancel',
        },
      });

      const confirmed = await firstValueFrom(dialogRef.afterClosed());
      if (!confirmed) return;
    }

    this.currentDesignId = null;
    this.constructorConfig.canvasArray =
      this.constructorService.clearAllCanvas();
    this.hasUnsavedChanges = false;

    // Clear URL parameters
    this.router.navigate(['/'], { queryParams: {} });
    this.showSuccess('Created new design');
  }

  onViewSavedDesigns(): void {
    this.router.navigate(['/designs']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
