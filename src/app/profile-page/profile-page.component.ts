import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { DesignService } from '../services/design.service';
import { BeadDesign } from '../models/design.model';

interface UserStats {
  totalDesigns: number;
  createdThisMonth: number;
  lastDesignDate: Date | null;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  isSaving = false;

  currentUser: any = null;
  userStats: UserStats = {
    totalDesigns: 0,
    createdThisMonth: 0,
    lastDesignDate: null,
  };

  recentDesigns: BeadDesign[] = [];

  private authSubscription?: Subscription;
  private designsSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private designService: DesignService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserStats();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }], // Email readonly
      bio: ['', [Validators.maxLength(500)]],
      location: ['', [Validators.maxLength(100)]],
      website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  private async loadUserData(): Promise<void> {
    this.isLoading = true;

    try {
      this.currentUser = await this.authService.getUserOnce();

      if (this.currentUser) {
        this.profileForm.patchValue({
          displayName: this.currentUser.displayName || '',
          email: this.currentUser.email || '',
          bio: this.currentUser.bio || '',
          location: this.currentUser.location || '',
          website: this.currentUser.website || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.showError('Failed to load profile data');
    } finally {
      this.isLoading = false;
    }
  }

  private loadUserStats(): void {
    this.designsSubscription = this.designService.getUserDesigns().subscribe({
      next: (designs: BeadDesign[]) => {
        this.calculateStats(designs);
        this.recentDesigns = designs.slice(0, 3); // Show 3 most recent
      },
      error: (error) => {
        console.error('Error loading user designs:', error);
      },
    });
  }

  private calculateStats(designs: BeadDesign[]): void {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.userStats = {
      totalDesigns: designs.length,
      createdThisMonth: designs.filter((design) => {
        const createdDate = new Date(design.createdAt);
        return (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        );
      }).length,
      lastDesignDate:
        designs.length > 0 ? new Date(designs[0].updatedAt) : null,
    };
  }

  onEditToggle(): void {
    if (this.isEditing) {
      // Cancel editing - reload original data
      this.loadUserData();
    }
    this.isEditing = !this.isEditing;
  }

  async onSaveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;

    try {
      const formData = this.profileForm.getRawValue();

      // Here you would update user profile in Firebase Auth and/or Firestore
      // For now, we'll just simulate the save
      await this.simulateProfileUpdate(formData);

      this.isEditing = false;
      this.showSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      this.showError('Failed to update profile');
    } finally {
      this.isSaving = false;
    }
  }

  private async simulateProfileUpdate(profileData: any): Promise<void> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Implement actual Firebase user profile update
    console.log('Profile data to save:', profileData);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }

  onDeleteAccount(): void {
    // TODO: Implement account deletion with confirmation dialog
    console.log('Delete account requested');
  }

  onChangePassword(): void {
    // TODO: Implement password change
    console.log('Change password requested');
  }

  onExportData(): void {
    // TODO: Implement data export
    console.log('Export data requested');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }

    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }

    if (control?.hasError('maxlength')) {
      return `${fieldName} must not exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }

    if (control?.hasError('pattern')) {
      return `Please enter a valid ${fieldName.toLowerCase()}`;
    }

    return '';
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

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.designsSubscription?.unsubscribe();
  }
}
