import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdUbicacion } from './modal-updUbicacion.component';

describe('DialogUpdUbicacion', () => {
  let component: DialogUpdUbicacion;
  let fixture: ComponentFixture<DialogUpdUbicacion>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUpdUbicacion ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdUbicacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
