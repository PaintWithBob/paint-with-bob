import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLobbyPageComponent } from './join-lobby-page.component';

describe('JoinLobbyPageComponent', () => {
  let component: JoinLobbyPageComponent;
  let fixture: ComponentFixture<JoinLobbyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinLobbyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinLobbyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
