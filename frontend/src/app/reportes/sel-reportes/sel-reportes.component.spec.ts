import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelReportesComponent } from './sel-reportes.component';

describe('SelReportesComponent', () => {
  let component: SelReportesComponent;
  let fixture: ComponentFixture<SelReportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelReportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
