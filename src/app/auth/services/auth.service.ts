import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../interfaces/auth-data.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private router: Router, private _afa: AngularFireAuth) {}

  initAuthListener() {
    this._afa.authState.subscribe((user) => {
      if (user) {
        this.authenticated.next(true);
        this.router.navigate(['']);
      } else {
        this.authenticated.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): Promise<any> {
    return this._afa.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    );
  }

  login(authData: AuthData) {
    this._afa
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    this._afa.signOut();
  }
}
