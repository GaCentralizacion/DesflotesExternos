import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMapa } from './alert-mapa.component';

describe('DialogAsignar', () => {
  let component: DialogMapa;
  let fixture: ComponentFixture<DialogMapa>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMapa ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
