import { TestBed, inject } from '@angular/core/testing';

import { configureServiceTestBed } from '../../../test-utils';

import { LobbyService } from './lobby.service';

describe('LobbyService', () => {
  beforeEach(() => {
    configureServiceTestBed(TestBed, LobbyService);
  });

  it('should be created', inject([LobbyService], (service: LobbyService) => {
    expect(service).toBeTruthy();
  }));
});
