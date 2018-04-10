import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configureComponentTestBed } from '../../../test-utils';

import { CreateLobbyPopupComponent } from './create-lobby-popup.component';

describe('CreateLobbyPopupComponent', () => {
  let component: CreateLobbyPopupComponent;
  let fixture: ComponentFixture<CreateLobbyPopupComponent>;

  beforeEach(async(() => {
    configureComponentTestBed(TestBed, CreateLobbyPopupComponent);
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
