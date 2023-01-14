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

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  maxDate: Date;
  minDate: Date;

  constructor(private fb: FormBuilder) {}

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
    console.log(this.signupForm.getRawValue());
  }
}
