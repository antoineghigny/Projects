import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get isLoading$(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  setLoading(value: boolean) {
    this._isLoading.next(value);
  }
}
