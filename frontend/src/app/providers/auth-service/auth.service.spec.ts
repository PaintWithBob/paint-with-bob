import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthServiceService]
    });
  });

  it('should be created', inject([AuthServiceService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
