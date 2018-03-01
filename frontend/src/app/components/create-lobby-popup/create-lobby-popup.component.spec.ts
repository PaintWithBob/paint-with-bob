import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLobbyPopupComponent } from './create-lobby-popup.component';

describe('CreateLobbyPopupComponent', () => {
  let component: CreateLobbyPopupComponent;
  let fixture: ComponentFixture<CreateLobbyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLobbyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLobbyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
