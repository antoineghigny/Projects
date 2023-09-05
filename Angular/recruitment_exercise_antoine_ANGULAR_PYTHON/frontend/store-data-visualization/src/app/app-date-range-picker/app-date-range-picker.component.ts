import {Component, Output, EventEmitter, OnInit, Input} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {StoreService} from "../store.service";
import {ErrorService} from "../error.service";
import {LoadingService} from "../loading.service";
import {catchError, delay, EMPTY, Observable, of, retry, throwError} from "rxjs";

@Component({
  selector: 'app-app-date-range-picker',
  templateUrl: './app-date-range-picker.component.html',
})
export class AppDateRangePickerComponent {
  @Output() dateRangeSelected = new EventEmitter<{ startDate: Date, endDate: Date }>();
  @Output() inputsValid = new EventEmitter<boolean>();
  form: FormGroup;
  constructor(private storeService: StoreService, private fb: FormBuilder) {
    this.form = this.fb.group({
      minWeekInput: ['', [Validators.required, this.weekFormatValidator]],
      maxWeekInput: ['', [Validators.required, this.weekFormatValidator]],
      selectedStrategy: [1, [Validators.required]],
      selectedStrategy2: [1, [Validators.required]],
    });
  }

  minWeekInput: string = '';
  maxWeekInput: string = '';

  convertMinWeek!: string;
  convertMaxWeek!: string;
  selectedStrategy: number = 1;
  selectedStrategy2: number = 1;

  private weekFormatRegex = /^W\s*(\d+)\s+(\d{4})$/;
  weekFormatError = 'Le format doit être Wx yyyy (ex: W3 2023)';
  minWeekErrorMessage: string = '';
  maxWeekErrorMessage: string = '';
  options: { value: number, label: string }[] = [
    { value: 1, label: '1' },
    { value: 4, label: '4' },
    { value: 7, label: '7' }
  ];

  weekFormatValidator = (control: any) => {
    const value = control.value;
    return this.weekFormatRegex.test(value) ? null : {weekFormat: this.weekFormatError};
  }
  maximum: string = "Maximum";
  minimum: string = "Minimum";
  handleWeekInputBlur(inputType: 'min' | 'max') {
    const weekInput = inputType === 'min' ? this.minWeekInput : this.maxWeekInput;
    if (this.weekFormatRegex.test(weekInput)) {
      const weekStartDate = this.parseWeekAndYear(weekInput);
      if (weekStartDate) {
        const selectedStrategy = inputType === 'min' ? this.selectedStrategy : this.selectedStrategy2;
        this.checkDateValidity(weekStartDate.year, weekStartDate.week, selectedStrategy).pipe(
          catchError(error => {
            return of(false);
          })
        ).subscribe(validityResponse => {
          if (validityResponse) {
            this.clearWeekErrorMessage(inputType);
            this.handleValidDate(inputType, weekStartDate);
          } else {
            this.handleInvalidDate(inputType);
          }
        });
      } else {
        this.handleInvalidDate(inputType);
      }
    } else {
      this.setWeekErrorMessage(inputType, 'Invalid week format');
    }
  }

  clearWeekErrorMessage(inputType: 'min' | 'max') {
      this.setWeekErrorMessage(inputType, '');
  }

  setWeekErrorMessage(inputType: 'min' | 'max', message: string) {
    if (inputType === 'min') {
      this.minWeekErrorMessage = message;
    } else if (inputType === 'max') {
      this.maxWeekErrorMessage = message;
    }
    this.inputsValid.emit(false);
  }

  handleValidDate(inputType: 'min' | 'max', weekStartDate: { year: number; week: number }) {
    const selectedStrategy = inputType === 'min' ? this.selectedStrategy : this.selectedStrategy2;
    const dateObservable = this.getDate(weekStartDate.year, weekStartDate.week, selectedStrategy);

    dateObservable.pipe(
      catchError((error) => {
        this.setWeekErrorMessage(inputType, 'Error retrieving date, please try again\n');
        return of(null);
      })
    ).subscribe(date => {
      if (date !== null) {
        if (inputType === 'min') {
          this.convertMinWeek = date;
        } else {
          this.convertMaxWeek = date;
        }
        this.updateDateRange();
        this.emitFormValidity();
      }
    });
  }

  handleInvalidDate(inputType: 'min' | 'max') {
    if (inputType === 'min') {
      this.minWeekErrorMessage = `The selected date is not valid. Please choose a date between W42 2022 and W29 2023`;
    } else {
      this.maxWeekErrorMessage = `The selected date is not valid. Please choose a date between W42 2022 and W29 2023`;
    }
    this.inputsValid.emit(false);
  }

  checkDateValidity(year: number, week: number, weekStrategy: number): Observable<boolean> {
    return this.storeService.checkDateValidity(year, week, weekStrategy);
  }

  getDate(year: number, week: number, weekStrategy: number): Observable<string> {
    return this.storeService.getDate(year, week, weekStrategy);
  }

  parseWeekAndYear(input: string): { week: number; year: number } | undefined {
    const match = input.match(this.weekFormatRegex);
    return match ? { week: parseInt(match[1]), year: parseInt(match[2]) } : undefined;
  }

  updateDateRange() {
    const convertedMaxDate = new Date(this.convertMaxWeek);
    const convertedMinDate = new Date(this.convertMinWeek);
    this.dateRangeSelected.emit({startDate: convertedMinDate, endDate: convertedMaxDate});
  }

  emitFormValidity() {
    if (this.convertMinWeek && this.convertMaxWeek)
      this.inputsValid.emit(true);
  }

  handleOptionSelected(selectedValue: number, inputType: 'min' | 'max') {
    if (inputType === 'min') {
      this.selectedStrategy = selectedValue;
    } else {
      this.selectedStrategy2 = selectedValue;
    }
    this.handleWeekInputBlur(inputType);
  }
}
