import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { configurePageComponentTestBed } from '../../../test-utils';

import { TermsOfServiceComponent } from './terms-of-service.component';

describe('TermsOfServiceComponent', () => {
  let component: TermsOfServiceComponent;
  let fixture: ComponentFixture<TermsOfServiceComponent>;

  beforeEach(async(() => {
    configurePageComponentTestBed(TestBed, TermsOfServiceComponent);
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(TermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
