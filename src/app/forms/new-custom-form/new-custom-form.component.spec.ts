import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomFormComponent } from './new-custom-form.component';

describe('NewCustomFormComponent', () => {
  let component: NewCustomFormComponent;
  let fixture: ComponentFixture<NewCustomFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCustomFormComponent]
    });
    fixture = TestBed.createComponent(NewCustomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
