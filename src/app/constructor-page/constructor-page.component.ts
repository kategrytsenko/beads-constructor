import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConstructorConfig,
  PaintBlockModel,
} from '../models/constructor-models';
import { AuthService } from '../core/auth/auth.service';
import { DesignService } from '../services/design.service';
import { Subscription } from 'rxjs';
import { MotivateLoginPopupComponent } from './components/motivate-login-popup/motivate-login-popup.component';
import { SaveDesignDialogComponent, SaveDesignDialogData, SaveDesignDialogResult } from './components/save-design-dialog/save-design-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstructorService } from '../services/constructor.service';
import { ColorsService } from '../services/colors.service';
import { CreateDesignRequest, BeadDesign } from '../models/design.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange$$.subscribe(
      (authStatus: boolean) => {
        this.isAuth = authStatus;
      }
    );
    
    this.constructorConfig = this.constructorService.getConstructorConfig();
    
    this.checkForDesignId();
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
          
          this.constructorConfig = this.constructorService.resetConstructorConfig(
            this.rawBeadsAmount,
            this.columnBeadsAmount
          );
          
          this.constructorConfig.canvasArray = design.canvasData;
          this.hasUnsavedChanges = false;
          
          this.showSuccess(`Дизайн "${design.name}" завантажено`);
        } else {
          this.showError('Дизайн не знайдено');
          this.router.navigate(['/'], { queryParams: {} });
        }
        this.isLoadingDesign = false;
      },
      error: () => {
        this.isLoadingDesign = false;
        this.showError('Помилка завантаження дизайну');
        this.router.navigate(['/'], { queryParams: {} });
      }
    });
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
    const hasContent = this.constructorConfig.canvasArray.some(row => 
      row.some(block => block.color !== '#ffffff')
    );

    if (hasContent) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Очистити canvas?',
          message: 'Ви впевнені, що хочете очистити весь canvas? Цю дію неможливо скасувати.',
          confirmText: 'Очистити',
          cancelText: 'Скасувати'
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.performClearCanvas();
        }
      });
    } else {
      this.performClearCanvas();
    }
  }

  private performClearCanvas(): void {
    this.constructorConfig.canvasArray = this.constructorService.clearAllCanvas();
    this.hasUnsavedChanges = true;
  }

  setNewDimensions() {
    const hasContent = this.constructorConfig.canvasArray.some(row => 
      row.some(block => block.color !== '#ffffff')
    );

    if (hasContent) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Змінити розмір canvas?',
          message: 'Зміна розміру canvas призведе до втрати поточного дизайну. Продовжити?',
          confirmText: 'Змінити',
          cancelText: 'Скасувати'
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.performDimensionChange();
        }
      });
    } else {
      this.performDimensionChange();
    }
  }

  private performDimensionChange(): void {
    this.clearAllCanvas();
    this.constructorConfig = this.constructorService.resetConstructorConfig(
      this.rawBeadsAmount,
      this.columnBeadsAmount
    );
    this.currentDesignId = null; // Новий canvas = новий дизайн
    this.hasUnsavedChanges = false;
  }

  onColorChanged(paintedBlock: PaintBlockModel) {
    this.constructorConfig.canvasArray = this.constructorService.onColorChanged(
      paintedBlock,
      this.selectedColor
    );
    this.hasUnsavedChanges = true;
  }

  async onDesignSave() {
    if (!this.isAuth) {
      this.dialog.open(MotivateLoginPopupComponent);
      return;
    }

    const dialogData: SaveDesignDialogData = {
      mode: this.currentDesignId ? 'update' : 'create'
    };

    // Якщо оновлюємо існуючий дизайн, завантажимо поточні дані
    if (this.currentDesignId) {
      // Тут можна додати завантаження існуючих назви та опису
    }

    const dialogRef = this.dialog.open(SaveDesignDialogComponent, {
      data: dialogData,
      disableClose: true,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(async (result: SaveDesignDialogResult | null) => {
      if (result) {
        await this.saveDesign(result);
      }
    });
  }

  private async saveDesign(dialogResult: SaveDesignDialogResult): Promise<void> {
    this.isSaving = true;

    try {
      const designData: CreateDesignRequest = {
        name: dialogResult.name,
        description: dialogResult.description,
        canvasData: JSON.parse(JSON.stringify(this.constructorConfig.canvasArray)), // deep copy
        dimensions: {
          rows: this.rawBeadsAmount,
          columns: this.columnBeadsAmount
        }
      };

      if (this.currentDesignId) {
        // Оновлення існуючого дизайну
        const success = await this.designService.updateDesign({
          id: this.currentDesignId,
          ...designData
        });
        
        if (success) {
          this.hasUnsavedChanges = false;
        }
      } else {
        // Створення нового дизайну
        const newDesignId = await this.designService.createDesign(designData);
        
        if (newDesignId) {
          this.currentDesignId = newDesignId;
          this.hasUnsavedChanges = false;
          
          // Оновлюємо URL з новим ID
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { designId: newDesignId },
            queryParamsHandling: 'merge'
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
          title: 'Незбережені зміни',
          message: 'У вас є незбережені зміни. Ви впевнені, що хочете створити новий дизайн?',
          confirmText: 'Створити новий',
          cancelText: 'Скасувати'
        }
      });

      const confirmed = await dialogRef.afterClosed().toPromise();
      if (!confirmed) return;
    }

    this.currentDesignId = null;
    this.constructorConfig.canvasArray = this.constructorService.clearAllCanvas();
    this.hasUnsavedChanges = false;
    
    // Очищуємо URL
    this.router.navigate(['/'], { queryParams: {} });
    this.showSuccess('Створено новий дизайн');
  }

  onViewSavedDesigns(): void {
    this.router.navigate(['/designs']);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Закрити', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Закрити', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}