import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private _snackbar: MatSnackBar, private _afa: AngularFireAuth) {}

  openSnackBar(message: string) {
    this._snackbar.open(message, null, {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }

  getLoggedInUserId() {
    return this._afa.authState.pipe(
      take(1),
      map((user) => {
        return user.uid;
      })
    );
  }
}
