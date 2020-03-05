import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGameParentComponent } from './edit-game-parent.component';

describe('EditGameParentComponent', () => {
  let component: EditGameParentComponent;
  let fixture: ComponentFixture<EditGameParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGameParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGameParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
