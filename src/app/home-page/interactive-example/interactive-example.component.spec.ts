import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveExampleComponent } from './interactive-example.component';

describe('InteractiveExampleComponent', () => {
  let component: InteractiveExampleComponent;
  let fixture: ComponentFixture<InteractiveExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
