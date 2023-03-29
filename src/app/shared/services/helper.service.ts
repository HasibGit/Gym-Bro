import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private _snackbar: MatSnackBar) {}

  openSnackBar(message: string) {
    this._snackbar.open(message, null, {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }
}
