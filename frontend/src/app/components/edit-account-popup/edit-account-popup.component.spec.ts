import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configureComponentTestBed } from '../../../test-utils';

import { EditAccountPopupComponent } from './edit-account-popup.component';

describe('EditAccountPopupComponent', () => {
  let component: EditAccountPopupComponent;
  let fixture: ComponentFixture<EditAccountPopupComponent>;

  beforeEach(async(() => {
    configureComponentTestBed(TestBed, EditAccountPopupComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
