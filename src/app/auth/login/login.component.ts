import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    private _snackbar: MatSnackBar
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
        this._snackbar.open(error.message, null, {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 3000,
        });
        this.isLoading = false;
      });
  }
}
