import { TestBed, async, inject } from '@angular/core/testing';

import { PromotorGuard } from './promotor.guard';

describe('PromotorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromotorGuard]
    });
  });

  it('should ...', inject([PromotorGuard], (guard: PromotorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
