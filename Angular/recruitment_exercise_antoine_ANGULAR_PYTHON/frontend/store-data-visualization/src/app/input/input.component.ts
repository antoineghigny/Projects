import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  @Input() value!: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() inputType!: string;
  @Input() isError!: boolean;
  onValueChange() {
    this.valueChange.emit(this.value);
  }
}
