import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyPageComponent } from './lobby-page.component';

describe('LobbyPageComponent', () => {
  let component: LobbyPageComponent;
  let fixture: ComponentFixture<LobbyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
