import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface SaveDesignDialogData {
  mode: 'create' | 'update';
  existingName?: string;
  existingDescription?: string;
}

export interface SaveDesignDialogResult {
  name: string;
  description: string;
}

@Component({
  selector: 'app-save-design-dialog',
  templateUrl: './save-design-dialog.component.html',
  styleUrls: ['./save-design-dialog.component.scss'],
})
export class SaveDesignDialogComponent {
  designForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<SaveDesignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaveDesignDialogData,
    private fb: FormBuilder
  ) {
    this.designForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [
        this.data.existingName || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      description: [
        this.data.existingDescription || '',
        [Validators.maxLength(200)],
      ],
    });
  }

  onSave(): void {
    if (this.designForm.valid) {
      this.isLoading = true;

      const result: SaveDesignDialogResult = {
        name: this.designForm.get('name')?.value.trim(),
        description: this.designForm.get('description')?.value.trim() || '',
      };

      // Імітуємо невелику затримку для UX
      setTimeout(() => {
        this.dialogRef.close(result);
      }, 500);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
