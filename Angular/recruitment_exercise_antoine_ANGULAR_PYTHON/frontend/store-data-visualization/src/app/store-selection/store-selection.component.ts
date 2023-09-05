import { Component, OnInit } from '@angular/core';
import { StoreService, Store, DataResponse } from "../store.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import {ErrorService} from "../error.service";
import {catchError, delay, finalize, retry} from "rxjs";
import {LoadingService} from "../loading.service";

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.component.html',
  styleUrls: ['./store-selection.component.css']
})
export class StoreSelectionComponent implements OnInit {
  stores: Store[] = [];
  selectedStore!: number;
  dataResponse: DataResponse | null = null;
  selectedStartDate!: Date;
  selectedEndDate!: Date;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isChartVisible: boolean = false;
  visitorsData!: Record<string, number>;
  turnoverData!: Record<string, number>;
  areInputsValid = false;
  constructor(private storeService: StoreService, private errorService: ErrorService, public loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.loadStores();
  }

  loadStores() {
    this.loadingService.setLoading(true);
    this.storeService.getStores().pipe(
      retry(3),
      delay(1000),
      catchError(error => {
        this.errorMessage = this.errorService.handleError(error);
        return [];
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    ).subscribe(
      (stores: Store[]) => {
        this.stores = stores;
      }
    );
  }

  submitSelection() {
    const formattedStartDate = this.selectedStartDate.toISOString().slice(0, 10);
    const formattedEndDate = this.selectedEndDate.toISOString().slice(0, 10);
    this.isChartVisible = false;

    this.storeService.getData(this.selectedStore, formattedStartDate, formattedEndDate).pipe(
      catchError(error => {
        this.errorMessage = this.errorService.handleError(error);
        return [];
      })
    ).subscribe(
      (response: DataResponse) => {
        this.dataResponse = response;
        this.errorMessage = null;
        this.isChartVisible = true;
        this.visitorsData = response.visitors_per_week;
        this.turnoverData = response.turnover_per_week;
      },
    );
  }

  handleDateRangeSelection(event: { startDate: Date, endDate: Date }) {
    this.selectedStartDate = event.startDate;
    this.selectedEndDate = event.endDate;
  }

  onInputsValid(valid: boolean) {
    this.areInputsValid = valid;
  }
}
