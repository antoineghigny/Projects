import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Store {
  id: number;
  name: string;
  week_strategy: number;
}

export interface DataResponse {
  visitors_per_week: { [date: string]: number };
  turnover_per_week: { [date: string]: number };
}

export interface BoundingBox {
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Zone {
  id: number;
  name: string;
  color: [number, number, number, number];
  coords: Point[][];
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private baseUrl = 'http://localhost:8001';

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/stores`);
  }

  checkDateValidity(year: number, week: number, weekStrategy: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/date-validity/${year}/${week}?week_strategy=${weekStrategy}`);
  }

  getData(storeId: number, startDate: string, endDate: string): Observable<DataResponse> {
    return this.http.get<DataResponse>(`${this.baseUrl}/data?store_id=${storeId}&start_date=${startDate}&end_date=${endDate}`);
  }

  getDate(year: number, week: number, weekStrategy: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/date/${year}/${week}?week_strategy=${weekStrategy}`);
  }
  getMapImage(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/bonus/map`, { responseType: 'blob' });
  }

  getBoundingBox(): Observable<BoundingBox> {
    return this.http.get<BoundingBox>(`${this.baseUrl}/bonus/bbox`);
  }

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.baseUrl}/bonus/zones`);
  }
}
