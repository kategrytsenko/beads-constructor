import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { PaintBlockModel } from './paint-block.model';

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

  changeCanvasColor(paintBlockData: PaintBlockModel) {
    this.colorChanged.emit(paintBlockData);
  }
}
