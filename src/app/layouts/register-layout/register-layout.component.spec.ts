import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLayoutComponent } from './register-layout.component';

describe('RegisterLayoutComponent', () => {
  let component: RegisterLayoutComponent;
  let fixture: ComponentFixture<RegisterLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
