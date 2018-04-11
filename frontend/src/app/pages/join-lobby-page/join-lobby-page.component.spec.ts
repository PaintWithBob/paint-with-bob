import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configurePageComponentTestBed } from '../../../test-utils';

import { JoinLobbyPageComponent } from './join-lobby-page.component';

describe('JoinLobbyPageComponent', () => {
  let component: JoinLobbyPageComponent;
  let fixture: ComponentFixture<JoinLobbyPageComponent>;

  beforeEach(async(() => {
    configurePageComponentTestBed(TestBed, JoinLobbyPageComponent);
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
