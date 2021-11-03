import { TestBed } from '@angular/core/testing';

import { TestthreeService } from './testthree.service';

describe('TestthreeService', () => {
  let service: TestthreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestthreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
