import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import * as fromRoot from '../../state/app/app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit {
  @Output('sidenavLinkClicked') sidenavLinkClicked: EventEmitter<void> =
    new EventEmitter();
  loggedIn$: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.loggedIn$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onClickSidenavLink() {
    this.sidenavLinkClicked.emit();
  }

  logout() {
    this.authService.logout();
    this.onClickSidenavLink();
  }
}
