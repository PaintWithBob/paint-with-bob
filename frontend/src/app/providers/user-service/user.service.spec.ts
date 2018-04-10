import { TestBed, inject } from '@angular/core/testing';

import { configureServiceTestBed } from '../../../test-utils';

import { UserService } from './user.service';

describe('UserService', () => {
  beforeEach(() => {
    configureServiceTestBed(TestBed, UserService);
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
