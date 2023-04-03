import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorPageComponent } from './constructor-page.component';

describe('ConstructorPageComponent', () => {
  let component: ConstructorPageComponent;
  let fixture: ComponentFixture<ConstructorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConstructorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
