import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDropdownComponent } from './strategy-dropdown.component';

describe('StrategyDropdownComponent', () => {
  let component: StrategyDropdownComponent;
  let fixture: ComponentFixture<StrategyDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StrategyDropdownComponent]
    });
    fixture = TestBed.createComponent(StrategyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
