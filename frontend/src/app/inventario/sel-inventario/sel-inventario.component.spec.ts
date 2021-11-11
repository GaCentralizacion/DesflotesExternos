import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelInventarioComponent } from './sel-inventario.component';

describe('SelInventarioComponent', () => {
  let component: SelInventarioComponent;
  let fixture: ComponentFixture<SelInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
