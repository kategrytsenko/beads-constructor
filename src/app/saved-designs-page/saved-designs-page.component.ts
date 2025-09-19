// src/app/saved-designs-page/saved-designs-page.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BeadDesign } from '../models/design.model';
import { DesignService } from '../services/design.service';
import { AuthService } from '../core/auth/auth.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-saved-designs-page',
  templateUrl: './saved-designs-page.component.html',
  styleUrls: ['./saved-designs-page.component.scss'],
})
export class SavedDesignsPageComponent implements OnInit, OnDestroy {
  designs: BeadDesign[] = [];
  isLoading = true;
  isAuth = false;

  private designsSubscription?: Subscription;
  private authSubscription?: Subscription;

  constructor(
    private designService: DesignService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange$$.subscribe(
      (authStatus: boolean) => {
        this.isAuth = authStatus;
        if (authStatus) {
          this.loadUserDesigns();
        } else {
          this.designs = [];
          this.isLoading = false;
        }
      }
    );
  }

  private loadUserDesigns(): void {
    this.isLoading = true;

    this.designsSubscription = this.designService.getUserDesigns().subscribe({
      next: (designs: BeadDesign[]) => {
        this.designs = designs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading designs:', error);
        this.showError('Failed to load designs');
        this.isLoading = false;
      },
    });
  }

  onCreateNew(): void {
    this.router.navigate(['/']);
  }

  onEditDesign(design: BeadDesign): void {
    this.router.navigate(['/'], {
      queryParams: { designId: design.id },
    });
  }

  onDuplicateDesign(design: BeadDesign): void {
    const dialogData: ConfirmDialogData = {
      title: 'Duplicate Design',
      message: `Create a copy of "${design.name}"?`,
      confirmText: 'Duplicate',
      cancelText: 'Cancel',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        const newName = `${design.name} (Copy)`;
        const newDesignId = await this.designService.duplicateDesign(
          design.id!,
          newName
        );

        if (newDesignId) {
          this.showSuccess('Design duplicated successfully');
          // Designs will auto-refresh due to observable subscription
        }
      }
    });
  }

  onDeleteDesign(design: BeadDesign): void {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Design',
      message: `Are you sure you want to delete "${design.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'warn',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        const success = await this.designService.deleteDesign(design.id!);
        if (success) {
          this.showSuccess('Design deleted successfully');
          // Designs will auto-refresh due to observable subscription
        }
      }
    });
  }

  onShareDesign(design: BeadDesign): void {
    // TODO: Implement sharing functionality
    this.showInfo('Sharing feature coming soon!');
  }

  getDesignPreview(design: BeadDesign): string {
    // Generate a simple color grid preview
    if (!design.canvasData || design.canvasData.length === 0) {
      return this.getPlaceholderImage();
    }

    // For now, return placeholder. Later we can generate actual canvas preview
    return design.thumbnail || this.getPlaceholderImage();
  }

  private getPlaceholderImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4MFY4MEg0MFY0MFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+Cg==';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  trackByDesignId(index: number, design: BeadDesign): string {
    return design.id || index.toString();
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

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['info-snackbar'],
    });
  }

  ngOnDestroy(): void {
    this.designsSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
