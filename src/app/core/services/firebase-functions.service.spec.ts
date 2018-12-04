import { TestBed } from '@angular/core/testing';

import { FirebaseFunctionsService } from './firebase-functions.service';

describe('FirebaseFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseFunctionsService = TestBed.get(FirebaseFunctionsService);
    expect(service).toBeTruthy();
  });
});
