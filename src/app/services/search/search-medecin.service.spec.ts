import { TestBed } from '@angular/core/testing';

import { SearchMedecinService } from './search-medecin.service';

describe('SearchMedecinService', () => {
  let service: SearchMedecinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchMedecinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
