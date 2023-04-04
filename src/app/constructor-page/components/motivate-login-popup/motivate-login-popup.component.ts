import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motivate-login-popup',
  templateUrl: './motivate-login-popup.component.html',
  styleUrls: ['./motivate-login-popup.component.scss'],
})
export class MotivateLoginPopupComponent {
  constructor(
    private dialogRef: MatDialogRef<MotivateLoginPopupComponent>,
    private router: Router
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}
