import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModeloVersion } from './modelo-version.component';

describe('DialogModeloVersion', () => {
  let component: DialogModeloVersion;
  let fixture: ComponentFixture<DialogModeloVersion>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogModeloVersion ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModeloVersion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
