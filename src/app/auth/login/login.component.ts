import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '../../shared/services/helper.service';
import { AuthData } from '../interfaces/auth-data.interface';
import { LoginFormRawValue } from '../interfaces/login.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _router: Router,
    private _helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
    });
  }

  login() {
    this.isLoading = true;
    const loginData: LoginFormRawValue = this.loginForm.getRawValue();
    const authData: AuthData = {
      email: loginData.Email,
      password: loginData.Password,
    };
    this.authService
      .login(authData)
      .then((result) => {
        this.isLoading = false;
        this._router.navigate(['']);
      })
      .catch((error) => {
        this._helperService.openSnackBar(error.message);
        this.isLoading = false;
      });
  }
}
