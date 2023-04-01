import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintBlockComponent } from './paint-block.component';

describe('PaintBlockComponent', () => {
  let component: PaintBlockComponent;
  let fixture: ComponentFixture<PaintBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaintBlockComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
