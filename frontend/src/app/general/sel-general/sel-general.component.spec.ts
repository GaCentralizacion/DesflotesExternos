import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelGeneralComponent } from './sel-general.component';

describe('SelGeneralComponent', () => {
  let component: SelGeneralComponent;
  let fixture: ComponentFixture<SelGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
