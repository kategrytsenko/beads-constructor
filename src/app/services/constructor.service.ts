import { Injectable } from '@angular/core';
import {
  ConstructorConfig,
  PaintBlockModel,
} from '../models/constructor.model';
import { generateCanvasArray, getArrayWithSettedLength } from '../utils';

@Injectable()
export class ConstructorService {
  rowBeadsAmount: number = Number(localStorage.getItem('rowBeadsAmount')) || 11;
  columnBeadsAmount: number =
    Number(localStorage.getItem('columnBeadsAmount')) || 11;

  private canvasArray: PaintBlockModel[][] = [];

  getCanvasArray(): PaintBlockModel[][] {
    return this.canvasArray.slice();
  }

  saveToStorage(rowBeadsAmount: number, columnBeadsAmount: number): void {
    localStorage.setItem('rowBeadsAmount', rowBeadsAmount.toString());
    localStorage.setItem('columnBeadsAmount', columnBeadsAmount.toString());
    localStorage.setItem('canvasArray', JSON.stringify(this.canvasArray));
  }

  getConfig(
    rowBeadsAmount: number,
    columnBeadsAmount: number
  ): ConstructorConfig {
    return {
      beadsRawArray: getArrayWithSettedLength(rowBeadsAmount),
      beadsColumnArray: getArrayWithSettedLength(columnBeadsAmount),
      canvasArray: this.getCanvasArray(),
    };
  }

  getConstructorConfig(): ConstructorConfig {
    this.canvasArray =
      JSON.parse(localStorage.getItem('canvasArray') || 'null') ||
      generateCanvasArray(this.rowBeadsAmount, this.columnBeadsAmount);

    this.saveToStorage(this.rowBeadsAmount, this.columnBeadsAmount);

    return this.getConfig(this.rowBeadsAmount, this.columnBeadsAmount);
  }

  resetConstructorConfig(
    rowBeadsAmount: number,
    columnBeadsAmount: number
  ): ConstructorConfig {
    this.rowBeadsAmount = rowBeadsAmount;
    this.columnBeadsAmount = columnBeadsAmount;
    this.canvasArray = generateCanvasArray(rowBeadsAmount, columnBeadsAmount);

    this.saveToStorage(rowBeadsAmount, columnBeadsAmount);

    return this.getConfig(rowBeadsAmount, columnBeadsAmount);
  }

  onColorChanged(
    paintedBlock: PaintBlockModel,
    selectedColor: string
  ): PaintBlockModel[][] {
    const updatedObject = { id: paintedBlock.id, color: selectedColor };

    this.canvasArray = this.canvasArray.map((row) => {
      return row.map((object) => {
        return object.id === updatedObject.id ? updatedObject : object;
      });
    });

    localStorage.setItem('canvasArray', JSON.stringify(this.canvasArray));

    return this.getCanvasArray();
  }

  clearAllCanvas(): PaintBlockModel[][] {
    this.canvasArray = this.canvasArray.map((row) => {
      return row.map((object) => {
        object.color = '#ffffff';

        return object;
      });
    });

    localStorage.setItem('canvasArray', JSON.stringify(this.canvasArray));

    return this.getCanvasArray();
  }
}
