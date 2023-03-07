import { TestBed } from '@angular/core/testing';

import { MainGroupService } from './main-group.service';

describe('MainGroupService', () => {
  let service: MainGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
