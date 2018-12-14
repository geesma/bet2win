import { TestBed, async, inject } from '@angular/core/testing';

import { DeveloperGuard } from './developer.guard';

describe('DeveloperGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeveloperGuard]
    });
  });

  it('should ...', inject([DeveloperGuard], (guard: DeveloperGuard) => {
    expect(guard).toBeTruthy();
  }));
});
