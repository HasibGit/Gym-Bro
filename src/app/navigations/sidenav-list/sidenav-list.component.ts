import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output('sidenavLinkClicked') sidenavLinkClicked: EventEmitter<void> =
    new EventEmitter();
  authStatusSubscription: Subscription;
  loggedIn = false;
  constructor(private authService: AuthService) {}

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

  onClickSidenavLink() {
    this.sidenavLinkClicked.emit();
  }

  logout() {
    this.authService.logout();
    this.onClickSidenavLink();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
