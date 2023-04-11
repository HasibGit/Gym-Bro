import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HelperService } from '../../shared/services/helper.service';
import { AuthData } from '../interfaces/auth-data.interface';
import { SignupFormRawValue } from '../interfaces/sign-up.interface';
import { AuthService } from '../services/auth.service';
import * as fromRoot from '../../state/app/app.reducer';
import * as UI from '../../shared/state/ui.actions';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  maxDate: Date;
  minDate: Date;
  isLoading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _helperService: HelperService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.initSignupForm();
    this.setBirthDateRangeLimit();
  }

  initSignupForm() {
    this.signupForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      BirthDate: ['', Validators.required],
      TermsAgreed: [false, Validators.requiredTrue],
    });
  }

  setBirthDateRangeLimit() {
    this.maxDate = new Date();
    this.minDate = new Date();
    const today = new Date();
    this.maxDate.setFullYear(today.getFullYear() - 18);
    this.minDate.setFullYear(today.getFullYear() - 80);
  }

  signup() {
    this.store.dispatch(new UI.StartLoading());
    const formValue: SignupFormRawValue = this.signupForm.getRawValue();
    const userRegistryData: AuthData = {
      email: formValue.Email,
      password: formValue.Password,
    };
    this.authService
      .registerUser(userRegistryData)
      .then((res) => {
        this.store.dispatch(new UI.StopLoading());
        this.router.navigate(['auth/login']);
      })
      .catch((error) => {
        this._helperService.openSnackBar(error.message);
        this.store.dispatch(new UI.StopLoading());
      });
  }
}
