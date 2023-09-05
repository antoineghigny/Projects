import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  handleError(error: HttpErrorResponse): string {
    let errorMessage = 'Une erreur est survenue.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else if (error.status === 400) {
      errorMessage = error.error.detail;
    } else if (error.status === 404) {
      errorMessage = `Magasin non trouvé`;
    }
    return errorMessage;
  }
}
