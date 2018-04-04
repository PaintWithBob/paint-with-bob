import { TestBed, inject } from '@angular/core/testing';

import { configureServiceTestBed } from '../../../test-utils';

import { AuthService } from './auth.service';

describe('AuthService', () => {

  beforeEach(() => {
    configureServiceTestBed(TestBed, AuthService);
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
