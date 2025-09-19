import { PaintBlockModel } from './constructor.model';

export interface BeadDesign {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  canvasData: PaintBlockModel[][];
  dimensions: {
    rows: number;
    columns: number;
  };
  thumbnail?: string; // base64 мініатюра для превью
  isPublic?: boolean; // для майбутньої функції поділитися
}

export interface CreateDesignRequest {
  name: string;
  description?: string;
  canvasData: PaintBlockModel[][];
  dimensions: {
    rows: number;
    columns: number;
  };
}

export interface UpdateDesignRequest extends Partial<CreateDesignRequest> {
  id: string;
}
