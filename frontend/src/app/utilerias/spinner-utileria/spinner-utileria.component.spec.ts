import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerUtileriaComponent } from './spinner-utileria.component';

describe('SpinnerUtileriaComponent', () => {
  let component: SpinnerUtileriaComponent;
  let fixture: ComponentFixture<SpinnerUtileriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerUtileriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerUtileriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
