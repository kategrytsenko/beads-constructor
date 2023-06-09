import { PaintBlockModel } from './models/constructor-models';

export const getArrayWithSettedLength = (length: number): number[] => {
  return Array.from({ length }, (_, i) => i);
};

export const generateCanvasArray = (
  rawAmount: number,
  columnAmount: number
): PaintBlockModel[][] => {
  const canvasArray = [];

  for (let i = 0; i < rawAmount; i++) {
    const row: PaintBlockModel[] = [];

    for (let j = 0; j < columnAmount; j++) {
      row.push({ id: i * columnAmount + j, color: 'white' });
    }

    canvasArray.push(row);
  }

  return canvasArray;
};
