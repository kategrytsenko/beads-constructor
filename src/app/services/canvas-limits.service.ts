import { Injectable } from '@angular/core';
import { CanvasLimits, ValidationResult } from '../models/validation.model';

@Injectable({
  providedIn: 'root',
})
export class CanvasLimitsService {
  // Ліміти для різних типів користувачів
  private readonly FREE_USER_LIMITS: CanvasLimits = {
    minRows: 1,
    maxRows: 50,
    minColumns: 5,
    maxColumns: 200,
    maxTotalCells: 5000,
  };

  private readonly PREMIUM_USER_LIMITS: CanvasLimits = {
    minRows: 1,
    maxRows: 100,
    minColumns: 5,
    maxColumns: 300,
    maxTotalCells: 10000,
  };

  private readonly PERFORMANCE_LIMITS = {
    warningThreshold: 4500,
    dangerThreshold: 9000,
  };

  validateCanvasSize(
    rows: number,
    columns: number,
    isPremiumUser: boolean = false
  ): ValidationResult {
    const limits = isPremiumUser
      ? this.PREMIUM_USER_LIMITS
      : this.FREE_USER_LIMITS;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (rows < limits.minRows) {
      errors.push(`Minimum number of rows is ${limits.minRows}`);
    }

    if (columns < limits.minColumns) {
      errors.push(`Minimum number of columns is ${limits.minColumns}`);
    }

    if (rows > limits.maxRows) {
      errors.push(
        `Maximum number of rows is ${limits.maxRows}${
          isPremiumUser ? ' (Premium)' : ' (upgrade for more)'
        }`
      );
    }

    if (columns > limits.maxColumns) {
      errors.push(
        `Maximum number of columns is ${limits.maxColumns}${
          isPremiumUser ? ' (Premium)' : ' (upgrade for more)'
        }`
      );
    }

    const totalCells = rows * columns;
    if (totalCells > limits.maxTotalCells) {
      errors.push(
        `Total canvas size (${totalCells} cells) exceeds limit of ${limits.maxTotalCells} cells`
      );
    }

    if (totalCells > this.PERFORMANCE_LIMITS.dangerThreshold) {
      warnings.push(
        `Large canvas (${totalCells} cells) may cause performance issues on some devices`
      );
    } else if (totalCells > this.PERFORMANCE_LIMITS.warningThreshold) {
      warnings.push(
        `Medium canvas size (${totalCells} cells) - consider device performance`
      );
    }

    const aspectRatio = Math.max(rows, columns) / Math.min(rows, columns);
    if (aspectRatio > 10) {
      warnings.push(
        'Very narrow canvas proportions may be difficult to work with'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  getLimitsForUser(isPremiumUser: boolean = false): CanvasLimits {
    return isPremiumUser
      ? { ...this.PREMIUM_USER_LIMITS }
      : { ...this.FREE_USER_LIMITS };
  }

  constrainToLimits(
    rows: number,
    columns: number,
    isPremiumUser: boolean = false
  ): { rows: number; columns: number; wasConstrained: boolean } {
    const limits = isPremiumUser
      ? this.PREMIUM_USER_LIMITS
      : this.FREE_USER_LIMITS;

    const originalRows = rows;
    const originalColumns = columns;

    rows = Math.max(limits.minRows, Math.min(limits.maxRows, rows));
    columns = Math.max(limits.minColumns, Math.min(limits.maxColumns, columns));

    const totalCells = rows * columns;
    if (totalCells > limits.maxTotalCells) {
      const scaleFactor = Math.sqrt(limits.maxTotalCells / totalCells);
      rows = Math.floor(rows * scaleFactor);
      columns = Math.floor(columns * scaleFactor);

      rows = Math.max(limits.minRows, rows);
      columns = Math.max(limits.minColumns, columns);
    }

    const wasConstrained = originalRows !== rows || originalColumns !== columns;

    return { rows, columns, wasConstrained };
  }

  getRecommendedSizesForJewelry(
    isPremiumUser: boolean = false
  ): Array<{ rows: number; columns: number; label: string; product: string }> {
    return [
      // Кільця
      { rows: 5, columns: 50, label: 'Ring - Narrow', product: 'ring' },
      { rows: 7, columns: 50, label: 'Ring - Wide', product: 'ring' },

      // Браслети
      { rows: 7, columns: 100, label: 'Bracelet - Thin', product: 'bracelet' },
      {
        rows: 9,
        columns: 100,
        label: 'Bracelet - Medium',
        product: 'bracelet',
      },
      { rows: 11, columns: 100, label: 'Bracelet - Wide', product: 'bracelet' },

      // Чокери
      { rows: 8, columns: 200, label: 'Choker - Simple', product: 'choker' },
      { rows: 12, columns: 200, label: 'Choker - Wide', product: 'choker' },

      // // Сережки
      // { rows: 20, columns: 8, label: 'Earrings - Long', product: 'earrings' },
      // { rows: 15, columns: 12, label: 'Earrings - Drop', product: 'earrings' },

      ...(isPremiumUser
        ? [
            // TODO: custom saved sizes
          ]
        : []),
    ].filter(
      (size) =>
        size.rows <=
          (isPremiumUser ? this.PREMIUM_USER_LIMITS : this.FREE_USER_LIMITS)
            .maxRows &&
        size.columns <=
          (isPremiumUser ? this.PREMIUM_USER_LIMITS : this.FREE_USER_LIMITS)
            .maxColumns &&
        size.rows * size.columns <=
          (isPremiumUser ? this.PREMIUM_USER_LIMITS : this.FREE_USER_LIMITS)
            .maxTotalCells
    );
  }

  getPerformanceWarning(rows: number, columns: number): string | null {
    const totalCells = rows * columns;

    if (totalCells > this.PERFORMANCE_LIMITS.dangerThreshold) {
      return 'This canvas size may cause significant performance issues. Consider using a smaller size.';
    }

    if (totalCells > this.PERFORMANCE_LIMITS.warningThreshold) {
      return 'This canvas size may affect performance on slower devices.';
    }

    return null;
  }
}
