import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMapPoolsFormComponent } from './edit-map-pools-form.component';

describe('EditMapPoolsFormComponent', () => {
  let component: EditMapPoolsFormComponent;
  let fixture: ComponentFixture<EditMapPoolsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMapPoolsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMapPoolsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
