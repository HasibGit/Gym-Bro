import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HelperService } from '../../shared/services/helper.service';
import { AuthData } from '../interfaces/auth-data.interface';
import { LoginFormRawValue } from '../interfaces/login.interface';
import { AuthService } from '../services/auth.service';
import * as fromRoot from '../../state/app/app.reducer';
import * as UI from '../../shared/state/ui.actions';
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
    private _store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.isLoading$ = this._store.select(fromRoot.getIsLoading);
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
    });
  }

  login() {
    this._store.dispatch(new UI.StartLoading());
    const loginData: LoginFormRawValue = this.loginForm.getRawValue();
    const authData: AuthData = {
      email: loginData.Email,
      password: loginData.Password,
    };
    this.authService
      .login(authData)
      .then((result) => {
        this._store.dispatch(new UI.StopLoading());
        this._router.navigate(['']);
      })
      .catch((error) => {
        this._helperService.openSnackBar(error.message);
        this._store.dispatch(new UI.StopLoading());
      });
  }
}
