export interface PaintBlockModel {
  color: string;
  id: number;
}

export interface ConstructorConfig {
  beadsRawArray: number[];
  beadsColumnArray: number[];
  canvasArray: PaintBlockModel[][];
}
