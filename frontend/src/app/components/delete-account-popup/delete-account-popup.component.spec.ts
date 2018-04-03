import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configureComponentTestBed } from '../../../test-utils';

import { DeleteAccountPopupComponent } from './delete-account-popup.component';

fdescribe('DeleteAccountPopupComponent', () => {
  let component: DeleteAccountPopupComponent;
  let fixture: ComponentFixture<DeleteAccountPopupComponent>;

  beforeEach(async(() => {
    configureComponentTestBed(TestBed, DeleteAccountPopupComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
