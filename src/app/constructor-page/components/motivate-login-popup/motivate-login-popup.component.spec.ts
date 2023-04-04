import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivateLoginPopupComponent } from './motivate-login-popup.component';

describe('MotivateLoginPopupComponent', () => {
  let component: MotivateLoginPopupComponent;
  let fixture: ComponentFixture<MotivateLoginPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotivateLoginPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MotivateLoginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
