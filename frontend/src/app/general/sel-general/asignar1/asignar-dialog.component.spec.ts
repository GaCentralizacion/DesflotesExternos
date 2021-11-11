import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAsignar } from './asignar-dialog.component';

describe('DialogAsignar', () => {
  let component: DialogAsignar;
  let fixture: ComponentFixture<DialogAsignar>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAsignar ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAsignar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
