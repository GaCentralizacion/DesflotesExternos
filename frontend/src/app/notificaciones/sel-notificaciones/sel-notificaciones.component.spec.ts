import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelNotificacionesComponent } from './sel-notificaciones.component';

describe('SelNotificacionesComponent', () => {
  let component: SelNotificacionesComponent;
  let fixture: ComponentFixture<SelNotificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelNotificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
