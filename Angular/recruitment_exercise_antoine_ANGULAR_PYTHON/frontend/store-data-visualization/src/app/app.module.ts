import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreSelectionComponent } from './store-selection/store-selection.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppDateRangePickerComponent } from './app-date-range-picker/app-date-range-picker.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { StrategyDropdownComponent } from './strategy-dropdown/strategy-dropdown.component';
import {InputComponent} from './input/input.component';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { TitleComponent } from './title/title.component';

@NgModule({
    declarations: [
        AppComponent,
        StoreSelectionComponent,
        AppDateRangePickerComponent,
        BarChartComponent,
        ErrorMessageComponent,
        StrategyDropdownComponent,
        InputComponent,
        TitleComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    RouterOutlet,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports:[
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
