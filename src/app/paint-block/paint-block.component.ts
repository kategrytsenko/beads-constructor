import { OnInit, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-paint-block',
  templateUrl: './paint-block.component.html',
  styleUrls: ['./paint-block.component.scss']
})
export class PaintBlockComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  color = '#000000';


  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#000000';
    }

    // const ctx = this.canvas.nativeElement.getContext('2d');
    // ctx.fillStyle = this.color;
    if (ctx) {
      ctx.fillStyle = this.color;
    }
    this.canvas.nativeElement.addEventListener('click', this.draw.bind(this));
  }

  draw(event: MouseEvent): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    const x = event.offsetX;
    const y = event.offsetY;
    ctx?.fillRect(x, y, 10, 10);
  }

  pourPaint(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      ctx.fillStyle = this.color;
    }
    ctx?.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

  }
}
