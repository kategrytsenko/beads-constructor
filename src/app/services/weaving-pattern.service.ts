import { Injectable, signal } from '@angular/core';

export enum WeavingPatternType {
  STRAIGHT = 'straight',
  BRICK = 'brick',
  PEYOTE = 'peyote', // for the future (could be changed)
  HERRINGBONE = 'herringbone', // for the future (could be changed)
}

export interface WeavingPattern {
  type: WeavingPatternType;
  name: string;
  description: string;
  offsetEvenRows: boolean;
  offsetAmount: number;
  aspectRatio: number;
  usedFor: string[];
}

@Injectable({
  providedIn: 'root',
})
export class WeavingPatternService {
  private readonly AVAILABLE_PATTERNS: WeavingPattern[] = [
    {
      type: WeavingPatternType.STRAIGHT,
      name: 'Straight Weaving',
      description:
        'Traditional grid pattern where beads align in perfect rows and columns',
      offsetEvenRows: false,
      offsetAmount: 0,
      aspectRatio: 1,
      usedFor: ['Simple bracelets', 'Bookmarks', 'Belts', 'Basic patterns'],
    },
    // TODO:
    // {
    //   type: WeavingPatternType.BRICK,
    //   name: 'Brick/Mosaic Weaving',
    //   description:
    //     'Offset pattern where beads in alternating rows are shifted for a brick-like appearance',
    //   offsetEvenRows: true,
    //   offsetAmount: 0.5,
    //   aspectRatio: 0.866,
    //   usedFor: ['Chokers', 'Wide bracelets', 'Earrings', 'Decorative panels'],
    // },
  ];

  private currentPattern = signal<WeavingPattern>(this.AVAILABLE_PATTERNS[0]);

  get patterns(): WeavingPattern[] {
    return [...this.AVAILABLE_PATTERNS];
  }

  get current() {
    return this.currentPattern.asReadonly();
  }

  setPattern(type: WeavingPatternType): void {
    const pattern = this.AVAILABLE_PATTERNS.find((p) => p.type === type);
    if (pattern) {
      this.currentPattern.set(pattern);
    }
  }

  getCellStyles(
    row: number,
    col: number,
    cellSize: number
  ): { [key: string]: string } {
    const pattern = this.currentPattern();
    const styles: { [key: string]: string } = {
      width: `${cellSize}px`,
      height: `${cellSize * pattern.aspectRatio}px`,
      'min-width': `${cellSize}px`,
      'min-height': `${cellSize * pattern.aspectRatio}px`,
    };

    // for brick pattern
    if (pattern.offsetEvenRows && row % 2 === 1) {
      const offsetPx = cellSize * pattern.offsetAmount;
      styles['margin-left'] = `${offsetPx}px`;
    }

    return styles;
  }

  getRowStyles(rowIndex: number): { [key: string]: string } {
    const pattern = this.currentPattern();
    const styles: { [key: string]: string } = {
      display: 'flex',
      'align-items': 'center',
    };

    // TODO: check additional styles for brick pattern
    if (pattern.type === WeavingPatternType.BRICK) {
      styles['margin-bottom'] = '-2px';
    }

    return styles;
  }

  calculateCanvasSize(
    rows: number,
    cols: number,
    cellSize: number
  ): { width: number; height: number } {
    const pattern = this.currentPattern();

    let width = cols * cellSize;
    let height = rows * cellSize * pattern.aspectRatio;

    // TODO: check additional styles for brick pattern
    if (pattern.offsetEvenRows) {
      width += cellSize * pattern.offsetAmount;
    }

    return { width, height };
  }

  /**
   * Check for the future templates
   */
  isCellVisible(
    row: number,
    col: number,
    totalRows: number,
    totalCols: number
  ): boolean {
    // Поки що всі клітинки видимі для обох патернів
    return true;
  }

  //   TODO: check and reset
  getRecommendedSizesForProducts(): {
    [productType: string]: {
      rows: number;
      cols: number;
      pattern: WeavingPatternType;
    }[];
  } {
    return {
      bracelet: [
        { rows: 7, cols: 60, pattern: WeavingPatternType.STRAIGHT },
        { rows: 9, cols: 80, pattern: WeavingPatternType.STRAIGHT },
        { rows: 11, cols: 100, pattern: WeavingPatternType.STRAIGHT },
        { rows: 8, cols: 70, pattern: WeavingPatternType.BRICK },
        { rows: 10, cols: 90, pattern: WeavingPatternType.BRICK },
      ],
      choker: [
        { rows: 12, cols: 120, pattern: WeavingPatternType.BRICK },
        { rows: 15, cols: 140, pattern: WeavingPatternType.BRICK },
        { rows: 10, cols: 100, pattern: WeavingPatternType.STRAIGHT },
      ],
      ring: [
        { rows: 5, cols: 15, pattern: WeavingPatternType.STRAIGHT },
        { rows: 6, cols: 18, pattern: WeavingPatternType.BRICK },
      ],
      earrings: [
        { rows: 15, cols: 8, pattern: WeavingPatternType.BRICK },
        { rows: 20, cols: 6, pattern: WeavingPatternType.STRAIGHT },
      ],
    };
  }

  serializePattern(): string {
    return this.currentPattern().type;
  }

  deserializePattern(patternType: string): void {
    const type = patternType as WeavingPatternType;
    if (Object.values(WeavingPatternType).includes(type)) {
      this.setPattern(type);
    }
  }
}
