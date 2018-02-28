import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyPopupComponent } from './lobby-popup.component';

describe('LobbyPopupComponent', () => {
  let component: LobbyPopupComponent;
  let fixture: ComponentFixture<LobbyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
