import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-painting-panel',
  templateUrl: './painting-panel.component.html',
  styleUrls: ['./painting-panel.component.scss'],
})
export class PaintingPanelComponent {
  @Input() savedColors!: string[];
  @Input() selectedColor!: string;

  @Output() onSelectSavedColor = new EventEmitter<string>();
  @Output() onColorDelete = new EventEmitter<string>();
  @Output() onSaveColor = new EventEmitter<void>();
  @Output() onSetWhite = new EventEmitter<void>();

  @Output() colorChanged = new EventEmitter<string>();

  onColorChange(newColor: string) {
    this.selectedColor = newColor;
    this.colorChanged.emit(newColor);
  }
}
