import { TestBed } from '@angular/core/testing';

import { RealtimedatabaseService } from './realtimedatabase.service';

describe('RealtimedatabaseService', () => {
  let service: RealtimedatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimedatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
