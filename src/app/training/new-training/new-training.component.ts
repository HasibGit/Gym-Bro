import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WORKOUTS } from '../constants/trainings.constant';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  workouts: Exercise[];
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.workouts = this.trainingService.getAllExercises();
  }

  onStartTraining() {
    this.newTrainingStarted.emit(true);
  }
}
