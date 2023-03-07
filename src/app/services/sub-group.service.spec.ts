import { TestBed } from '@angular/core/testing';

import { SubGroupService } from './sub-group.service';

describe('SubGroupService', () => {
  let service: SubGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
