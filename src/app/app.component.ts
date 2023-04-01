import { Component, OnInit } from '@angular/core';

import { PaintBlockModel } from './paint-block/paint-block.model';
import { generateCanvasArray, getArrayWithSettedLength } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  defaultrawBeadsAmount = 11;
  defaultColumnBeadsAmount = 5;

  rawBeadsAmount: number =
    Number(localStorage.getItem('rawBeadsAmount')) ||
    this.defaultrawBeadsAmount;
  columnBeadsAmount: number =
    Number(localStorage.getItem('columnBeadsAmount')) ||
    this.defaultColumnBeadsAmount;

  beadsRawArray: number[] = getArrayWithSettedLength(this.rawBeadsAmount);
  beadsColumnArray: number[] = getArrayWithSettedLength(this.columnBeadsAmount);

  selectedColor = '#ffffff';

  canvasArray: PaintBlockModel[][] = [];
  savedColors: string[] = JSON.parse(localStorage.getItem('savedColors') || '[]');

  ngOnInit() {
    const canvasArray = JSON.parse(localStorage.getItem('canvasArray') || '[]');

    this.canvasArray = !canvasArray.length
      ? generateCanvasArray(this.rawBeadsAmount, this.columnBeadsAmount)
      : canvasArray;
  }

  setWhite() {
    this.selectedColor = '#ffffff';
  }

  saveColor() {
    if(this.savedColors.indexOf(this.selectedColor) === -1) {
      this.savedColors.push(this.selectedColor);
      localStorage.setItem('savedColors', JSON.stringify(this.savedColors));
    };
  }

  deleteColor(color: string) {
    const colorIndex = this.savedColors.indexOf(color);
    if(colorIndex !== -1) {
      this.savedColors.splice(colorIndex, 1);
      localStorage.setItem('savedColors', JSON.stringify(this.savedColors));
    };
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  updateArray(updatedObjects: PaintBlockModel[][]) {
    this.canvasArray = updatedObjects;

    localStorage.setItem('canvasArray', JSON.stringify(this.canvasArray));
  }

  clearAllCanvas() {
    const updatedObjects = this.canvasArray.map((row) => {
      return row.map((object) => {
        object.color = '#ffffff';

        return object;
      });
    });

    this.updateArray(updatedObjects);
  }

  setNewDimensions() {
    this.beadsRawArray = getArrayWithSettedLength(this.rawBeadsAmount);
    this.beadsColumnArray = getArrayWithSettedLength(this.columnBeadsAmount);

    localStorage.setItem('rawBeadsAmount', this.rawBeadsAmount.toString());
    localStorage.setItem(
      'columnBeadsAmount',
      this.columnBeadsAmount.toString()
    );

    this.clearAllCanvas();
    this.canvasArray = generateCanvasArray(
      this.rawBeadsAmount,
      this.columnBeadsAmount
    );
    localStorage.setItem('canvasArray', JSON.stringify(this.canvasArray));
  }

  onColorChanged(paintedBlock: PaintBlockModel) {
    const updatedObject = { id: paintedBlock.id, color: this.selectedColor };

    const updatedObjects = this.canvasArray.map((row) => {
      return row.map((object) => {
        return object.id === updatedObject.id ? updatedObject : object;
      });
    });

    this.updateArray(updatedObjects);
  }
}
