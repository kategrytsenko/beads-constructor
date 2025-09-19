import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, catchError, of, switchMap } from 'rxjs';
import {
  BeadDesign,
  CreateDesignRequest,
  UpdateDesignRequest,
} from '../models/design.model';
import { AuthService } from '../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DESIGN_MESSAGES } from '../constants/designs-page-messages.const';

@Injectable({ providedIn: 'root' })
export class DesignService {
  private firestore = inject(AngularFirestore);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  private readonly COLLECTION_NAME = 'beadDesigns';

  getUserDesigns(): Observable<BeadDesign[]> {
    return from(this.getCurrentUserId()).pipe(
      switchMap(userId => {
        console.log('Getting designs for userId:', userId); 
        if (!userId) {
          this.showError('User not authenticated');
          return of([]);
        }

        return this.firestore
          .collection<any>(this.COLLECTION_NAME, ref => 
            ref.where('userId', '==', userId)
               .orderBy('updatedAt', 'desc')
          )
          .snapshotChanges();
      }),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        
        // Десеріалізуємо canvasData з JSON string назад у масив
        const design: BeadDesign = {
          ...data,
          id,
          canvasData: typeof data.canvasData === 'string' 
            ? JSON.parse(data.canvasData) 
            : data.canvasData,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
        
        return design;
      })),
      catchError(error => {
        console.error('Error getting user designs:', error);
        this.showError(DESIGN_MESSAGES.designsLoadError);
        return of([]);
      })
    );
  }

  // Створити новий дизайн
  async createDesign(designData: CreateDesignRequest): Promise<string | null> {
    const userId = await this.getCurrentUserId();
    console.log('Creating design for userId:', userId); 
    
    if (!userId) {
      this.showError(DESIGN_MESSAGES.userNotAuthenticated);
      return null;
    }

    try {
      const now = new Date();
      const design = {
        name: designData.name,
        description: designData.description || '',
        userId,
        createdAt: now,
        updatedAt: now,
        dimensions: designData.dimensions,
        thumbnail: this.generateThumbnail(designData.canvasData),
        isPublic: false,
        // Серіалізуємо canvasData як JSON string
        canvasData: JSON.stringify(designData.canvasData)
      };

      console.log('Design data to save:', design); 

      const docRef = await this.firestore
        .collection(this.COLLECTION_NAME)
        .add(design);
      
      console.log('Design saved with ID:', docRef.id); 
      this.showSuccess(DESIGN_MESSAGES.designSavedSuccess);
      return docRef.id;
    } catch (error) {
      console.error('Error creating design:', error);
      this.showError(DESIGN_MESSAGES.designSaveError);
      return null;
    }
  }

  // Оновити існуючий дизайн
  async updateDesign(updateData: UpdateDesignRequest): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    console.log('Updating design for userId:', userId); 
    
    if (!userId) {
      this.showError(DESIGN_MESSAGES.userNotAuthenticated);
      return false;
    }

    try {
      const { id, ...dataToUpdate } = updateData;
      const updatePayload: any = {
        updatedAt: new Date(),
      };

      // Додаємо тільки ті поля, які передані
      if (dataToUpdate.name) updatePayload.name = dataToUpdate.name;
      if (dataToUpdate.description !== undefined) updatePayload.description = dataToUpdate.description;
      if (dataToUpdate.dimensions) updatePayload.dimensions = dataToUpdate.dimensions;

      if (dataToUpdate.canvasData) {
        updatePayload.canvasData = JSON.stringify(dataToUpdate.canvasData); // Серіалізуємо
        updatePayload.thumbnail = this.generateThumbnail(dataToUpdate.canvasData);
      }

      await this.firestore
        .collection(this.COLLECTION_NAME)
        .doc(id)
        .update(updatePayload);
      
      this.showSuccess(DESIGN_MESSAGES.designUpdatedSuccess);
      return true;
    } catch (error) {
      console.error('Error updating design:', error);
      this.showError(DESIGN_MESSAGES.designUpdateError);
      return false;
    }
  }

  // Видалити дизайн
  async deleteDesign(designId: string): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    console.log('Deleting design for userId:', userId); 
    
    if (!userId) {
      this.showError(DESIGN_MESSAGES.userNotAuthenticated);
      return false;
    }

    try {
      await this.firestore
        .collection(this.COLLECTION_NAME)
        .doc(designId)
        .delete();
      
      this.showSuccess(DESIGN_MESSAGES.designDeletedSuccess);
      return true;
    } catch (error) {
      console.error('Error deleting design:', error);
      this.showError(DESIGN_MESSAGES.designDeleteError);
      return false;
    }
  }

  // Отримати конкретний дизайн
  getDesignById(designId: string): Observable<BeadDesign | null> {
    return this.firestore
      .collection(this.COLLECTION_NAME)
      .doc<any>(designId)
      .snapshotChanges()
      .pipe(
        map((action) => {
          const data = action.payload.data();
          const id = action.payload.id;
          
          if (!data) return null;
          
          // Десеріалізуємо canvasData
          const design: BeadDesign = {
            ...data,
            id,
            canvasData: typeof data.canvasData === 'string' 
              ? JSON.parse(data.canvasData) 
              : data.canvasData,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          };
          
          return design;
        }),
        catchError((error) => {
          console.error('Error getting design:', error);
          this.showError(DESIGN_MESSAGES.designLoadError);
          return of(null);
        })
      );
  }

  // Дублювати дизайн
  async duplicateDesign(
    designId: string,
    newName: string
  ): Promise<string | null> {
    try {
      const designDoc = await this.firestore
        .collection(this.COLLECTION_NAME)
        .doc(designId)
        .get()
        .toPromise();

      if (!designDoc?.exists) {
        this.showError(DESIGN_MESSAGES.designNotFound);
        return null;
      }

      const originalData = designDoc.data() as any;
      
      // Десеріалізуємо canvasData для дублювання
      const canvasData = typeof originalData.canvasData === 'string' 
        ? JSON.parse(originalData.canvasData) 
        : originalData.canvasData;
      
      const duplicateData: CreateDesignRequest = {
        name: newName,
        description: originalData.description || '',
        canvasData: JSON.parse(JSON.stringify(canvasData)), // deep copy
        dimensions: { ...originalData.dimensions },
      };

      return await this.createDesign(duplicateData);
    } catch (error) {
      console.error('Error duplicating design:', error);
      this.showError(DESIGN_MESSAGES.designDuplicateError);
      return null;
    }
  }

  // Генерація thumbnail (спрощена версія)
  private generateThumbnail(canvasData: any[][]): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
  }

  private async getCurrentUserId(): Promise<string | null> {
    try {
      const user = await this.authService.getUserOnce();
      console.log('Current user from auth service:', user); 
      return user ? (user as any).uid : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}