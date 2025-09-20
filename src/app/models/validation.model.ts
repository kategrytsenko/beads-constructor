export interface CanvasLimits {
  minRows: number;
  maxRows: number;
  minColumns: number;
  maxColumns: number;
  maxTotalCells: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
