import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedDesignsPageComponent } from './saved-designs-page.component';

describe('SavedDesignsPageComponent', () => {
  let component: SavedDesignsPageComponent;
  let fixture: ComponentFixture<SavedDesignsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedDesignsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedDesignsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
