import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configurePageComponentTestBed } from '../../../test-utils';

import { LobbyPageComponent } from './lobby-page.component';

describe('LobbyPageComponent', () => {
  let component: LobbyPageComponent;
  let fixture: ComponentFixture<LobbyPageComponent>;

  beforeEach(async(() => {
    configurePageComponentTestBed(TestBed, LobbyPageComponent);
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
