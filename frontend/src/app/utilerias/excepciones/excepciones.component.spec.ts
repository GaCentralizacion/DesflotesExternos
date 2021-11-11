import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcepcionesComponent } from './excepciones.component';

describe('ExcepcionesComponent', () => {
  let component: ExcepcionesComponent;
  let fixture: ComponentFixture<ExcepcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcepcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
