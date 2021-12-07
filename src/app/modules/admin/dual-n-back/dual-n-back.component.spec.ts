import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualNBackComponent } from './dual-n-back.component';

describe('DualNBackComponent', () => {
  let component: DualNBackComponent;
  let fixture: ComponentFixture<DualNBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualNBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DualNBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
