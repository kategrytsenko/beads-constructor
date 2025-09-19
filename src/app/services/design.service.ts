import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, catchError, of } from 'rxjs';
import { BeadDesign, CreateDesignRequest, UpdateDesignRequest } from '../models/design.model';
import { AuthService } from '../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  private firestore = inject(AngularFirestore);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  private readonly COLLECTION_NAME = 'beadDesigns';

  getUserDesigns(): Observable<BeadDesign[]> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.showError('Користувач не авторизований');
      return of([]);
    }

    return this.firestore
      .collection<BeadDesign>(this.COLLECTION_NAME, ref => 
        ref.where('userId', '==', userId)
           .orderBy('updatedAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { ...data, id } as BeadDesign;
        })),
        catchError(error => {
          console.error('Error getting user designs:', error);
          this.showError('Помилка завантаження дизайнів');
          return of([]);
        })
      );
  }

  // Створити новий дизайн
  async createDesign(designData: CreateDesignRequest): Promise<string | null> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.showError('Користувач не авторизований');
      return null;
    }

    try {
      const now = new Date();
      const design: Omit<BeadDesign, 'id'> = {
        ...designData,
        userId,
        createdAt: now,
        updatedAt: now,
        thumbnail: this.generateThumbnail(designData.canvasData),
        isPublic: false
      };

      const docRef = await this.firestore.collection(this.COLLECTION_NAME).add(design);
      this.showSuccess('Дизайн збережено успішно!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating design:', error);
      this.showError('Помилка збереження дизайну');
      return null;
    }
  }

  // Оновити існуючий дизайн
  async updateDesign(updateData: UpdateDesignRequest): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.showError('Користувач не авторизований');
      return false;
    }

    try {
      const { id, ...dataToUpdate } = updateData;
      const updatePayload: Partial<BeadDesign> = {
        ...dataToUpdate,
        updatedAt: new Date()
      };

      // Якщо оновлюється canvasData, оновлюємо і thumbnail
      if (dataToUpdate.canvasData) {
        updatePayload.thumbnail = this.generateThumbnail(dataToUpdate.canvasData);
      }

      await this.firestore.collection(this.COLLECTION_NAME).doc(id).update(updatePayload);
      this.showSuccess('Дизайн оновлено успішно!');
      return true;
    } catch (error) {
      console.error('Error updating design:', error);
      this.showError('Помилка оновлення дизайну');
      return false;
    }
  }

  // Видалити дизайн
  async deleteDesign(designId: string): Promise<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.showError('Користувач не авторизований');
      return false;
    }

    try {
      await this.firestore.collection(this.COLLECTION_NAME).doc(designId).delete();
      this.showSuccess('Дизайн видалено успішно!');
      return true;
    } catch (error) {
      console.error('Error deleting design:', error);
      this.showError('Помилка видалення дизайну');
      return false;
    }
  }

  // Отримати конкретний дизайн
  getDesignById(designId: string): Observable<BeadDesign | null> {
    return this.firestore
      .collection(this.COLLECTION_NAME)
      .doc<BeadDesign>(designId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          return data ? { ...data, id } as BeadDesign : null;
        }),
        catchError(error => {
          console.error('Error getting design:', error);
          this.showError('Помилка завантаження дизайну');
          return of(null);
        })
      );
  }

  // Дублювати дизайн
  async duplicateDesign(designId: string, newName: string): Promise<string | null> {
    try {
      const designDoc = await this.firestore
        .collection(this.COLLECTION_NAME)
        .doc(designId)
        .get()
        .toPromise();

      if (!designDoc?.exists) {
        this.showError('Дизайн не знайдено');
        return null;
      }

      const originalDesign = designDoc.data() as BeadDesign;
      const duplicateData: CreateDesignRequest = {
        name: newName,
        description: originalDesign.description,
        canvasData: JSON.parse(JSON.stringify(originalDesign.canvasData)), // deep copy
        dimensions: { ...originalDesign.dimensions }
      };

      return await this.createDesign(duplicateData);
    } catch (error) {
      console.error('Error duplicating design:', error);
      this.showError('Помилка дублювання дизайну');
      return null;
    }
  }

  // Генерація thumbnail (спрощена версія)
  private generateThumbnail(canvasData: any[][]): string {
    // TODO: Реалізувати генерацію мініатюри canvas як base64
    // Поки що повертаємо заглушку
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
  }

  private getCurrentUserId(): string | null {
    // Отримуємо користувача синхронно з authService
    const user = this.authService.getUserOnce();
    return user ? (user as any).uid : null;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}