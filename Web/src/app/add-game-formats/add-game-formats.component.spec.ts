import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGameFormatsComponent } from './add-game-formats.component';

describe('AddGameFormatsComponent', () => {
  let component: AddGameFormatsComponent;
  let fixture: ComponentFixture<AddGameFormatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGameFormatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameFormatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
