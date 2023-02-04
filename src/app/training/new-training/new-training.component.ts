import { Component, OnInit } from '@angular/core';
import { WORKOUTS } from '../constants/trainings.constant';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  workouts = WORKOUTS;
  constructor() {}

  ngOnInit(): void {}
}
