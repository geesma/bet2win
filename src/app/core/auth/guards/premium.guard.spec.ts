import { TestBed, async, inject } from '@angular/core/testing';

import { PremiumGuard } from './premium.guard';

describe('PremiumGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PremiumGuard]
    });
  });

  it('should ...', inject([PremiumGuard], (guard: PremiumGuard) => {
    expect(guard).toBeTruthy();
  }));
});
