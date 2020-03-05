import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMapsComponent } from './edit-maps.component';

describe('EditMapsComponent', () => {
  let component: EditMapsComponent;
  let fixture: ComponentFixture<EditMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
