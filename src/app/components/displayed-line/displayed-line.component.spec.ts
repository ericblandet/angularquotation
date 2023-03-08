import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayedLineComponent } from './displayed-line.component';

describe('DisplayedLineComponent', () => {
  let component: DisplayedLineComponent;
  let fixture: ComponentFixture<DisplayedLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayedLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayedLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
