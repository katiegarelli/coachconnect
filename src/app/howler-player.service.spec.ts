import { TestBed } from '@angular/core/testing';

import { HowlerPlayerService } from './howler-player.service';

describe('HowlerPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HowlerPlayerService = TestBed.get(HowlerPlayerService);
    expect(service).toBeTruthy();
  });
});
