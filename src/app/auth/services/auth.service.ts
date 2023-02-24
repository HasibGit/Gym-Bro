import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../interfaces/auth-data.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User = {
    email: null,
    userId: null,
  };
  authenticated: Subject<boolean> = new Subject();

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user.email = authData.email;
    this.user.userId = Math.round(Math.random() * 10000).toString();
  }

  login(authData: AuthData) {
    this.user.email = authData.email;
    this.user.userId = Math.round(Math.random() * 10000).toString();
    this.authenticated.next(true);
  }

  logout() {
    this.user = {
      email: null,
      userId: null,
    };
    this.authenticated.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): User {
    return { ...this.user };
  }

  isAuthenticated(): boolean {
    return this.user.email !== null && this.user.userId !== null;
  }
}
