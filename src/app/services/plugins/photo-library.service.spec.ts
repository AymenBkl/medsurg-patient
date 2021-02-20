import { TestBed } from '@angular/core/testing';

import { PhotoLibraryService } from './photo-library.service';

describe('PhotoLibraryService', () => {
  let service: PhotoLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
