import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WORKOUTS } from '../constants/trainings.constant';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  workouts = WORKOUTS;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onStartTraining() {
    this.newTrainingStarted.emit(true);
  }
}
