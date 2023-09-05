import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-strategy-dropdown',
  templateUrl: './strategy-dropdown.component.html',
  styleUrls: ['./strategy-dropdown.component.css']
})
export class StrategyDropdownComponent {
  @Input() options: { value: number, label: string }[] = [];
  @Input() selectedValue: number = 1;
  @Output() optionSelected = new EventEmitter<number>();

  onOptionSelected(event: any) {
    console.log("onOptionSelected", event.target.value);
    const selectedValue = parseInt(event.target.value, 10);
    console.log(" selectedValue", selectedValue);
    this.selectedValue = selectedValue;
    this.optionSelected.emit(selectedValue);
  }
}
