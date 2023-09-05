import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDateRangePickerComponent } from './app-date-range-picker.component';

describe('AppDateRangePickerComponent', () => {
  let component: AppDateRangePickerComponent;
  let fixture: ComponentFixture<AppDateRangePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppDateRangePickerComponent]
    });
    fixture = TestBed.createComponent(AppDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
