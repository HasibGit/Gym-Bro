import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthData } from '../interfaces/auth-data.interface';
import { SignupFormRawValue } from '../interfaces/sign-up.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  maxDate: Date;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
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
    const formValue: SignupFormRawValue = this.signupForm.getRawValue();
    const userRegistryData: AuthData = {
      email: formValue.Email,
      password: formValue.Password,
    };
    this.authService
      .registerUser(userRegistryData)
      .then((res) => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this._snackbar.open(error.message, null, {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 3000,
        });
      });
  }
}
