import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapPoolsComponent } from './add-map-pools.component';

describe('AddMapPoolsComponent', () => {
  let component: AddMapPoolsComponent;
  let fixture: ComponentFixture<AddMapPoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapPoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapPoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
