import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaintBlockModel } from '../../../models/constructor.model';

@Component({
  selector: 'app-beads-constructor',
  templateUrl: './beads-constructor.component.html',
  styleUrls: ['./beads-constructor.component.scss'],
})
export class BeadsConstructorComponent {
  @Output() colorChanged = new EventEmitter<PaintBlockModel>();

  @Input() selectedColor!: string;
  @Input() beadsColumnArray!: number[];
  @Input() beadsRawArray!: number[];
  @Input() canvasArray!: PaintBlockModel[][];

  @Input() paintBlockData!: PaintBlockModel;

  // Нові входи для кастомних стилів
  @Input() cellStyles?: (row: number, col: number) => any;
  @Input() rowStyles?: (row: number) => any;
  @Input() showGrid: boolean = true;
  @Input() weavingPattern?: string;

  get isBrickPattern(): boolean {
    return this.weavingPattern === 'brick';
  }

  changeCanvasColor(paintBlockData: PaintBlockModel) {
    this.colorChanged.emit(paintBlockData);
  }

  getCellStyles(rowIndex: number, colIndex: number): any {
    // Використовуємо передані функції стилів, якщо вони є
    if (this.cellStyles) {
      return this.cellStyles(rowIndex, colIndex);
    }

    // Дефолтні стилі
    return this.getDefaultCellStyles();
  }

  getRowStyles(rowIndex: number): any {
    // Використовуємо передані функції стилів, якщо вони є
    if (this.rowStyles) {
      return this.rowStyles(rowIndex);
    }

    // Дефолтні стилі
    return {
      display: 'flex',
      'align-items': 'center',
    };
  }

  private getDefaultCellStyles(): any {
    return {
      width: '24px',
      height: '24px',
      'min-width': '24px',
      'min-height': '24px',
      margin: '1px',
      border: this.showGrid ? '1px solid #ddd' : '1px solid transparent',
      'border-radius': '2px',
      cursor: 'pointer',
    };
  }
}
