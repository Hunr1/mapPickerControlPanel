import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGameFormatsComponent } from './edit-game-formats.component';

describe('EditGameFormatsComponent', () => {
  let component: EditGameFormatsComponent;
  let fixture: ComponentFixture<EditGameFormatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGameFormatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGameFormatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
