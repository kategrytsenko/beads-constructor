import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PaintBlockModel } from './paint-block.model';

@Component({
  selector: 'app-paint-block',
  templateUrl: './paint-block.component.html',
  styleUrls: ['./paint-block.component.scss'],
})
export class PaintBlockComponent {
  @Output() colorChanged = new EventEmitter<PaintBlockModel>();

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  @Input() selectedColor!: string;

  @Input() paintBlockData!: PaintBlockModel;

  changeCanvasColor() {
    this.colorChanged.emit(this.paintBlockData);
  }
}
