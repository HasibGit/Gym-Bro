import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import * as fromRoot from '../../state/app/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output('toggleSideNav') toggleSidenav: EventEmitter<void> =
    new EventEmitter();
  loggedIn$: Observable<boolean>;
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.loggedIn$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }

  logout() {
    this.authService.logout();
  }
}
