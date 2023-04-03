import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingPanelComponent } from './painting-panel.component';

describe('PaintingPanelComponent', () => {
  let component: PaintingPanelComponent;
  let fixture: ComponentFixture<PaintingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaintingPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaintingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
