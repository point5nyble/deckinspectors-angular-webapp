import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterssComponent } from './counterss.component';

describe('CounterssComponent', () => {
  let component: CounterssComponent;
  let fixture: ComponentFixture<CounterssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterssComponent]
    });
    fixture = TestBed.createComponent(CounterssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
