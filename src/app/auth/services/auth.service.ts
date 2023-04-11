import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from '../interfaces/auth-data.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as fromAuth from '../state/auth.reducer';
import * as authActions from '../state/auth.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private _afa: AngularFireAuth,
    private store: Store<fromAuth.State>
  ) {}

  initAuthListener() {
    this._afa.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(new authActions.Authenticate());
        this.router.navigate(['']);
      } else {
        this.store.dispatch(new authActions.Unauthenticate());
        this.router.navigate(['auth/login']);
      }
    });
  }

  registerUser(authData: AuthData): Promise<any> {
    return this._afa.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    );
  }

  login(authData: AuthData): Promise<any> {
    return this._afa.signInWithEmailAndPassword(
      authData.email,
      authData.password
    );
  }

  logout() {
    this._afa.signOut().then(() => {
      this.store.dispatch(new authActions.Unauthenticate());
    });
  }
}
