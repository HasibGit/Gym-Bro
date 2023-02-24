import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output('toggleSideNav') toggleSidenav: EventEmitter<void> =
    new EventEmitter();
  authStatusSubscription: Subscription;
  loggedIn = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.authenticated.subscribe(
      (authStatus: boolean) => {
        if (authStatus) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      }
    );
  }

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
