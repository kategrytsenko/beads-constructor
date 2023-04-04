import { Injectable } from '@angular/core';

@Injectable()
export class ColorsService {
  savedColors: string[] = JSON.parse(
    localStorage.getItem('savedColors') || '[]'
  );

  getColors() {
    return this.savedColors.slice();
  }

  saveColor(selectedColor: string) {
    if (this.savedColors.indexOf(selectedColor) === -1) {
      this.savedColors.push(selectedColor);
      localStorage.setItem('savedColors', JSON.stringify(this.savedColors));
    }

    return this.getColors();
  }

  deleteColor(color: string) {
    const colorIndex = this.savedColors.indexOf(color);
    if (colorIndex !== -1) {
      this.savedColors.splice(colorIndex, 1);
      localStorage.setItem('savedColors', JSON.stringify(this.savedColors));
    }

    return this.getColors();
  }
}
