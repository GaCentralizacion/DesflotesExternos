import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCapturaComponent } from './ins-captura.component';

describe('InsCapturaComponent', () => {
  let component: InsCapturaComponent;
  let fixture: ComponentFixture<InsCapturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsCapturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsCapturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
