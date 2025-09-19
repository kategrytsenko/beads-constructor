import { Injectable } from '@angular/core';
import { CanvasLimits, ValidationResult } from '../models/validation.model';

@Injectable({
  providedIn: 'root',
})
export class CanvasLimitsService {
  private readonly FREE_USER_LIMITS: CanvasLimits = {
    minRows: 1,
    maxRows: 50,
    minColumns: 1,
    maxColumns: 50,
    maxTotalCells: 1500, // 30x50 max
  };

  private readonly PREMIUM_USER_LIMITS: CanvasLimits = {
    minRows: 1,
    maxRows: 100,
    minColumns: 1,
    maxColumns: 100,
    maxTotalCells: 5000, // 50x100 max
  };

  private readonly PERFORMANCE_LIMITS = {
    warningThreshold: 1000,
    dangerThreshold: 2500,
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

    // const aspectRatio = Math.max(rows, columns) / Math.min(rows, columns);
    // if (aspectRatio > 10) {
    //   warnings.push('Very narrow canvas proportions may be difficult to work with');
    // }

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

  getRecommendedSizes(
    isPremiumUser: boolean = false
  ): Array<{ rows: number; columns: number; label: string }> {
    const limits = isPremiumUser
      ? this.PREMIUM_USER_LIMITS
      : this.FREE_USER_LIMITS;

    return [
      { rows: 10, columns: 15, label: 'Small (150 beads)' },
      { rows: 20, columns: 25, label: 'Medium (500 beads)' },
      { rows: 30, columns: 35, label: 'Large (1,050 beads)' },
      ...(isPremiumUser
        ? [
            { rows: 40, columns: 50, label: 'Extra Large (2,000 beads)' },
            { rows: 50, columns: 70, label: 'Premium Max (3,500 beads)' },
          ]
        : []),
    ].filter(
      (size) =>
        size.rows <= limits.maxRows &&
        size.columns <= limits.maxColumns &&
        size.rows * size.columns <= limits.maxTotalCells
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
