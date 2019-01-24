import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowSliceComponent } from './arrow-slice.component';

describe('ArrowSliceComponent', () => {
  let component: ArrowSliceComponent;
  let fixture: ComponentFixture<ArrowSliceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrowSliceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowSliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
