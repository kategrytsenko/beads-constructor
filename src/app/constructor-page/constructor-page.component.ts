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
import { CanvasViewportService } from '../services/canvas-viewport.service';
import {
  WeavingPatternService,
  WeavingPatternType,
} from '../services/weaving-pattern.service';

@Component({
  selector: 'app-constructor-page',
  templateUrl: './constructor-page.component.html',
  styleUrls: ['./constructor-page.component.scss'],
})
export class ConstructorPageComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  isAuth = false;
  constructorConfig!: ConstructorConfig;
  rowBeadsAmount: number = this.constructorService.rowBeadsAmount;
  columnBeadsAmount: number = this.constructorService.columnBeadsAmount;
  selectedColor = '#ffffff';
  savedColors: string[] = this.colorsService.getColors();

  // Canvas limits and validation
  canvasLimits = this.canvasLimitsService.getLimitsForUser(false);
  validationErrors: string[] = [];
  validationWarnings: string[] = [];
  showLimitsInfo = false;

  // Viewport settings (використовуємо signals з сервісу)
  viewportSettings = this.canvasViewportService.settings;
  showGrid = true;

  // Weaving patterns (використовуємо signals з сервісу)
  currentWeavingPattern = this.weavingPatternService.current;
  availablePatterns = this.weavingPatternService.patterns;

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
    private canvasLimitsService: CanvasLimitsService,
    private canvasViewportService: CanvasViewportService,
    public weavingPatternService: WeavingPatternService // Зробили публічним
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange$$.subscribe(
      (authStatus: boolean) => {
        this.isAuth = authStatus;
      }
    );

    this.constructorConfig = this.constructorService.getConstructorConfig();

    // Initialize viewport with current canvas size
    this.initializeViewport();

    // Check if we need to load an existing design
    this.checkForDesignId();

    this.validateCanvasSize();
  }

  // ===== VIEWPORT METHODS (using your service) =====

  private initializeViewport(): void {
    // Auto-adjust cell size based on canvas dimensions
    this.canvasViewportService.setAutoSize(
      this.columnBeadsAmount,
      this.rowBeadsAmount
    );
  }

  onZoomIn(): void {
    this.canvasViewportService.zoomIn();
  }

  onZoomOut(): void {
    this.canvasViewportService.zoomOut();
  }

  onFitToScreen(): void {
    // Потребує розміри контейнера - можна передати через ViewChild або фіксовані значення
    const containerWidth = 800; // TODO: отримувати з ViewChild
    const containerHeight = 600;

    this.canvasViewportService.fitToContainer(
      containerWidth,
      containerHeight,
      this.columnBeadsAmount,
      this.rowBeadsAmount
    );
  }

  // ===== WEAVING PATTERN METHODS (using your service) =====

  onWeavingPatternChange(patternType: WeavingPatternType): void {
    this.weavingPatternService.setPattern(patternType);
    this.hasUnsavedChanges = true;
  }

  // ===== PRODUCT SIZE PRESETS =====

  getRecommendedProductSizes() {
    return this.weavingPatternService.getRecommendedSizesForProducts();
  }

  setProductSize(
    productType: string,
    preset: { rows: number; cols: number; pattern: any }
  ): void {
    this.columnBeadsAmount = preset.rows;
    this.rowBeadsAmount = preset.cols;
    this.weavingPatternService.setPattern(preset.pattern);
    this.validateCanvasSize();
    this.showSuccess(
      `Set ${productType} size: ${preset.rows}×${preset.cols} (${preset.pattern})`
    );
  }

  // ===== CANVAS STYLING (using your services) =====

  getCellStyles = (rowIndex: number, colIndex: number): any => {
    const viewportStyles = this.canvasViewportService.getCellStyles();
    const patternStyles = this.weavingPatternService.getCellStyles(
      rowIndex,
      colIndex,
      this.viewportSettings().cellSize
    );

    const gridStyles = this.showGrid
      ? { border: '1px solid #ddd' }
      : { border: 'none' };

    return { ...viewportStyles, ...patternStyles, ...gridStyles };
  };

  getRowStyles = (rowIndex: number): any => {
    return this.weavingPatternService.getRowStyles(rowIndex);
  };

  getCanvasStyles(): any {
    return this.canvasViewportService.getCanvasStyles(
      this.columnBeadsAmount,
      this.rowBeadsAmount
    );
  }

  // ===== CANVAS VALIDATION (existing) =====

  validateCanvasSize(): void {
    const validation = this.canvasLimitsService.validateCanvasSize(
      this.rowBeadsAmount,
      this.columnBeadsAmount,
      false
    );

    this.validationErrors = validation.errors;
    this.validationWarnings = validation.warnings;
  }

  onCanvasSizeChange(): void {
    this.validateCanvasSize();
    // Update viewport when canvas size changes
    this.canvasViewportService.setAutoSize(
      this.columnBeadsAmount,
      this.rowBeadsAmount
    );
  }

  constrainCanvasSize(): void {
    const constrained = this.canvasLimitsService.constrainToLimits(
      this.rowBeadsAmount,
      this.columnBeadsAmount,
      false
    );

    if (constrained.wasConstrained) {
      this.columnBeadsAmount = constrained.columns;
      this.rowBeadsAmount = constrained.rows;
      this.validateCanvasSize();
      this.showSuccess(
        `Canvas size adjusted to fit limits: ${constrained.rows}×${constrained.columns}`
      );
    }
  }

  setNewDimensions() {
    const validation = this.canvasLimitsService.validateCanvasSize(
      this.rowBeadsAmount,
      this.columnBeadsAmount,
      false
    );

    if (!validation.isValid) {
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

  toggleLimitsInfo(): void {
    this.showLimitsInfo = !this.showLimitsInfo;
  }

  setRecommendedSize(rows: number, columns: number): void {
    this.columnBeadsAmount = columns;
    this.rowBeadsAmount = rows;
    this.validateCanvasSize();
  }

  get recommendedSizes() {
    return this.canvasLimitsService.getRecommendedSizesForJewelry(false);
  }

  get canApplyDimensions(): boolean {
    const validation = this.canvasLimitsService.validateCanvasSize(
      this.rowBeadsAmount,
      this.columnBeadsAmount,
      false
    );
    return validation.isValid;
  }

  get performanceWarning(): string | null {
    return this.canvasLimitsService.getPerformanceWarning(
      this.rowBeadsAmount,
      this.columnBeadsAmount
    );
  }

  // ===== DESIGN LOADING/SAVING (existing methods) =====

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
          this.rowBeadsAmount = design.dimensions.rows;
          this.columnBeadsAmount = design.dimensions.columns;

          // Load weaving pattern if saved
          if (design.weavingPattern) {
            const patternType = design.weavingPattern as WeavingPatternType;
            this.weavingPatternService.setPattern(patternType);
          }

          this.constructorConfig =
            this.constructorService.resetConstructorConfig(
              this.rowBeadsAmount,
              this.columnBeadsAmount
            );

          this.applyDesignDataToCanvas(design.canvasData);
          this.hasUnsavedChanges = false;

          // Update viewport for loaded design
          this.onCanvasSizeChange();

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
    if (!savedCanvasData || savedCanvasData.length === 0) {
      return;
    }

    const savedRows = savedCanvasData.length;
    const savedCols = savedCanvasData[0]?.length || 0;
    const currentRows = this.constructorConfig.canvasArray.length;
    const currentCols = this.constructorConfig.canvasArray[0]?.length || 0;

    for (let row = 0; row < Math.min(savedRows, currentRows); row++) {
      for (let col = 0; col < Math.min(savedCols, currentCols); col++) {
        if (savedCanvasData[row] && savedCanvasData[row][col]) {
          const paintBlock: PaintBlockModel = {
            ...this.constructorConfig.canvasArray[row][col],
            color: savedCanvasData[row][col].color,
          };

          this.constructorConfig.canvasArray =
            this.constructorService.onColorChanged(
              paintBlock,
              savedCanvasData[row][col].color
            );
        }
      }
    }
  }

  // ===== COLOR METHODS (existing) =====

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

  // ===== CANVAS MANIPULATION (existing) =====

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

  private performDimensionChange(): void {
    this.clearAllCanvas();
    this.constructorConfig = this.constructorService.resetConstructorConfig(
      this.rowBeadsAmount,
      this.columnBeadsAmount
    );
    this.currentDesignId = null;
    this.hasUnsavedChanges = false;

    // Update viewport after dimension change
    this.onCanvasSizeChange();
  }

  onColorChanged(paintedBlock: PaintBlockModel | any) {
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

  // ===== SAVE/LOAD METHODS (updated to include weaving pattern) =====

  async onDesignSave() {
    if (!this.isAuth) {
      this.dialog.open(MotivateLoginPopupComponent);
      return;
    }

    let currentDesignData: BeadDesign | null = null;
    if (this.currentDesignId) {
      try {
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
        ),
        dimensions: {
          rows: this.rowBeadsAmount,
          columns: this.columnBeadsAmount,
        },
        weavingPattern: this.weavingPatternService.serializePattern(), // Save current pattern
      };

      if (this.currentDesignId) {
        const success = await this.designService.updateDesign({
          id: this.currentDesignId,
          ...designData,
        });

        if (success) {
          this.hasUnsavedChanges = false;
        }
      } else {
        const newDesignId = await this.designService.createDesign(designData);

        if (newDesignId) {
          this.currentDesignId = newDesignId;
          this.hasUnsavedChanges = false;

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

    // Reset to default weaving pattern
    this.weavingPatternService.setPattern(WeavingPatternType.STRAIGHT);

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
