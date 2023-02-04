import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output('toggleSideNav') toggleSidenav: EventEmitter<void> =
    new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
