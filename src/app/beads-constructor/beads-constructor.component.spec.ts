import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeadsConstructorComponent } from './beads-constructor.component';

describe('BeadsConstructorComponent', () => {
  let component: BeadsConstructorComponent;
  let fixture: ComponentFixture<BeadsConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeadsConstructorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BeadsConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
