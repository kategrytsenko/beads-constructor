import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConstructorConfig,
  PaintBlockModel,
} from '../models/constructor-models';
import { AuthService } from '../core/auth/auth.service';
import { Subscription } from 'rxjs';
import { MotivateLoginPopupComponent } from './components/motivate-login-popup/motivate-login-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConstructorService } from '../services/constructor.service';
import { ColorsService } from '../services/colors.service';

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

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private constructorService: ConstructorService,
    private colorsService: ColorsService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange$$.subscribe(
      (authStatus: boolean) => {
        this.isAuth = authStatus;
      }
    );

    this.constructorConfig = this.constructorService.getConstructorConfig();
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
    this.constructorConfig.canvasArray =
      this.constructorService.clearAllCanvas();
  }

  setNewDimensions() {
    this.clearAllCanvas();

    this.constructorConfig = this.constructorService.resetConstructorConfig(
      this.rawBeadsAmount,
      this.columnBeadsAmount
    );
  }

  onColorChanged(paintedBlock: PaintBlockModel) {
    this.constructorConfig.canvasArray = this.constructorService.onColorChanged(
      paintedBlock,
      this.selectedColor
    );
  }

  onDesignSave() {
    if (!this.isAuth) {
      this.dialog.open(MotivateLoginPopupComponent);
    } else {
      // TODO: implement
      console.log('Saving...');
      this.router.navigate(['/designs']);
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
