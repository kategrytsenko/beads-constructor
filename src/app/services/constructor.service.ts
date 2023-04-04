import { Injectable } from '@angular/core';
import {
  ConstructorConfig,
  PaintBlockModel,
} from '../models/constructor-models';
import { generateCanvasArray, getArrayWithSettedLength } from '../utils';

@Injectable()
export class ConstructorService {
  rawBeadsAmount: number = Number(localStorage.getItem('rawBeadsAmount')) || 11;
  columnBeadsAmount: number =
    Number(localStorage.getItem('columnBeadsAmount')) || 11;

  private canvasArray: PaintBlockModel[][] = [];

  getCanvasArray(): PaintBlockModel[][] {
    return this.canvasArray.slice();
  }

  saveToStorage(rawBeadsAmount: number, columnBeadsAmount: number): void {
    localStorage.setItem('rawBeadsAmount', rawBeadsAmount.toString());
    localStorage.setItem('columnBeadsAmount', columnBeadsAmount.toString());
    localStorage.setItem('canvasArray', JSON.stringify(this.canvasArray));
  }

  getConfig(
    rawBeadsAmount: number,
    columnBeadsAmount: number
  ): ConstructorConfig {
    return {
      beadsRawArray: getArrayWithSettedLength(rawBeadsAmount),
      beadsColumnArray: getArrayWithSettedLength(columnBeadsAmount),
      canvasArray: this.getCanvasArray(),
    };
  }

  getConstructorConfig(): ConstructorConfig {
    this.canvasArray =
      JSON.parse(localStorage.getItem('canvasArray') || 'null') ||
      generateCanvasArray(this.rawBeadsAmount, this.columnBeadsAmount);

    this.saveToStorage(this.rawBeadsAmount, this.columnBeadsAmount);

    return this.getConfig(this.rawBeadsAmount, this.columnBeadsAmount);
  }

  resetConstructorConfig(
    rawBeadsAmount: number,
    columnBeadsAmount: number
  ): ConstructorConfig {
    this.rawBeadsAmount = rawBeadsAmount;
    this.columnBeadsAmount = columnBeadsAmount;
    this.canvasArray = generateCanvasArray(rawBeadsAmount, columnBeadsAmount);

    this.saveToStorage(rawBeadsAmount, columnBeadsAmount);

    return this.getConfig(rawBeadsAmount, columnBeadsAmount);
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
