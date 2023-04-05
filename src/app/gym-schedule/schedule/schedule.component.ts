import { Component, OnInit } from '@angular/core';
import { WEEKDAYS } from '../constants/days.const';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  weekDays = WEEKDAYS;

  constructor() {}

  ngOnInit(): void {}
}
