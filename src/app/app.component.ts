import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { NavLink } from './interfaces/app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initAuthListener();
  }
}
