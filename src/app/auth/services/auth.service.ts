import { Injectable } from '@angular/core';
import { AuthData } from '../interfaces/auth-data.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User;
  constructor() {}

  registerUser(authData: AuthData) {
    this.user.email = authData.email;
    this.user.userId = Math.round(Math.random() * 10000).toString();
  }

  login(authData: AuthData) {
    this.user.email = authData.email;
    this.user.userId = Math.round(Math.random() * 10000).toString();
  }

  logout() {
    this.user = null;
  }

  getUser(): User {
    return { ...this.user };
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}
