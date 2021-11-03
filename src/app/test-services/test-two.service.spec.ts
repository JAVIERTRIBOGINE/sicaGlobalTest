import { TestBed } from '@angular/core/testing';

import { TestTwoService } from './test-two.service';

describe('TestTwoService', () => {
  let service: TestTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
