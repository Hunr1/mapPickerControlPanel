import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapsComponent } from './add-maps.component';

describe('AddMapsComponent', () => {
  let component: AddMapsComponent;
  let fixture: ComponentFixture<AddMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
