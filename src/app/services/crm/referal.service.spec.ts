import { TestBed } from '@angular/core/testing';

import { ReferalService } from './referal.service';

describe('ReferalService', () => {
  let service: ReferalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
