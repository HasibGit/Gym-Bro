import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HelperService } from '../../shared/services/helper.service';
import { AuthData } from '../interfaces/auth-data.interface';
import { LoginFormRawValue } from '../interfaces/login.interface';
import { AuthService } from '../services/auth.service';
import * as appReducer from '../../state/app/app.reducer';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _router: Router,
    private _helperService: HelperService,
    private _store: Store<{ ui: appReducer.State }>
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.isLoading$ = this._store.pipe(
      map((state) => {
        return state.ui.isLoading;
      })
    );
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
    });
  }

  login() {
    this._store.dispatch({ type: 'START_LOADING' });
    const loginData: LoginFormRawValue = this.loginForm.getRawValue();
    const authData: AuthData = {
      email: loginData.Email,
      password: loginData.Password,
    };
    this.authService
      .login(authData)
      .then((result) => {
        this._store.dispatch({ type: 'STOP_LOADING' });
        this._router.navigate(['']);
      })
      .catch((error) => {
        this._helperService.openSnackBar(error.message);
        this._store.dispatch({ type: 'STOP_LOADING' });
      });
  }
}
