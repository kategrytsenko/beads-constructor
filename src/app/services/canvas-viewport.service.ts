import { Injectable, signal } from '@angular/core';

export interface ViewportSettings {
  zoom: number;
  cellSize: number;
  minZoom: number;
  maxZoom: number;
  panX: number;
  panY: number;
}

@Injectable({
  providedIn: 'root',
})
export class CanvasViewportService {
  private readonly BASE_CELL_SIZE = 20;
  private readonly MIN_ZOOM = 0.25;
  private readonly MAX_ZOOM = 4;

  private viewportSettings = signal<ViewportSettings>({
    zoom: 1,
    cellSize: this.BASE_CELL_SIZE,
    minZoom: this.MIN_ZOOM,
    maxZoom: this.MAX_ZOOM,
    panX: 0,
    panY: 0,
  });

  get settings() {
    return this.viewportSettings.asReadonly();
  }

  /**
   * Збільшити масштаб
   */
  zoomIn(): void {
    const current = this.viewportSettings();
    const newZoom = Math.min(current.zoom * 1.25, current.maxZoom);
    this.setZoom(newZoom);
  }

  zoomOut(): void {
    const current = this.viewportSettings();
    const newZoom = Math.max(current.zoom / 1.25, current.minZoom);
    this.setZoom(newZoom);
  }

  setZoom(zoom: number): void {
    const current = this.viewportSettings();
    const clampedZoom = Math.max(
      current.minZoom,
      Math.min(current.maxZoom, zoom)
    );

    this.viewportSettings.update((settings) => ({
      ...settings,
      zoom: clampedZoom,
      cellSize: this.BASE_CELL_SIZE * clampedZoom,
    }));
  }

  fitToContainer(
    containerWidth: number,
    containerHeight: number,
    canvasRows: number,
    canvasCols: number
  ): void {
    const padding = 40;
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - padding;

    const zoomByWidth = availableWidth / (canvasCols * this.BASE_CELL_SIZE);
    const zoomByHeight = availableHeight / (canvasRows * this.BASE_CELL_SIZE);

    const optimalZoom = Math.min(zoomByWidth, zoomByHeight);
    this.setZoom(optimalZoom);

    this.centerCanvas(containerWidth, containerHeight, canvasRows, canvasCols);
  }

  calculateOptimalCellSize(
    rows: number,
    cols: number,
    maxViewportSize: number = 600
  ): number {
    const maxDimension = Math.max(rows, cols);

    if (maxDimension <= 20) return 25; // Великі клітинки для маленьких canvas
    if (maxDimension <= 50) return 15; // Середні клітинки
    if (maxDimension <= 100) return 10; // Маленькі клітинки
    return 8; // Дуже маленькі для великих canvas
  }

  setAutoSize(rows: number, cols: number): void {
    const optimalCellSize = this.calculateOptimalCellSize(rows, cols);
    const zoom = optimalCellSize / this.BASE_CELL_SIZE;
    this.setZoom(zoom);
  }

  centerCanvas(
    containerWidth: number,
    containerHeight: number,
    canvasRows: number,
    canvasCols: number
  ): void {
    const current = this.viewportSettings();
    const canvasWidth = canvasCols * current.cellSize;
    const canvasHeight = canvasRows * current.cellSize;

    const panX = Math.max(0, (containerWidth - canvasWidth) / 2);
    const panY = Math.max(0, (containerHeight - canvasHeight) / 2);

    this.viewportSettings.update((settings) => ({
      ...settings,
      panX,
      panY,
    }));
  }

  reset(): void {
    this.viewportSettings.set({
      zoom: 1,
      cellSize: this.BASE_CELL_SIZE,
      minZoom: this.MIN_ZOOM,
      maxZoom: this.MAX_ZOOM,
      panX: 0,
      panY: 0,
    });
  }

  getCanvasStyles(rows: number, cols: number): { [key: string]: string } {
    const current = this.viewportSettings();

    return {
      width: `${cols * current.cellSize}px`,
      height: `${rows * current.cellSize}px`,
      transform: `translate(${current.panX}px, ${current.panY}px)`,
      transition: 'transform 0.2s ease-out',
    };
  }

  getCellStyles(): { [key: string]: string } {
    const current = this.viewportSettings();

    return {
      width: `${current.cellSize}px`,
      height: `${current.cellSize}px`,
      'min-width': `${current.cellSize}px`,
      'min-height': `${current.cellSize}px`,
    };
  }
}
