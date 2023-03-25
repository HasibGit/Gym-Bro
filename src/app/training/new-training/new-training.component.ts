import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  workouts: Exercise[];
  selectWorkoutControl: FormControl = new FormControl('', Validators.required);
  chosenExercise: Exercise;
  isLoading: boolean;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.trainingService
      .fetchExercises()
      .pipe(take(1))
      .subscribe((res) => {
        this.workouts = res;
        this.isLoading = false;
      });
  }

  onStartTraining() {
    this.chosenExercise = this.workouts.find(
      (workout: Exercise) => workout.id === this.selectWorkoutControl.value
    );
    if (this.chosenExercise) {
      this.trainingService.setCurrentExercise(this.chosenExercise);
      this.newTrainingStarted.emit(true);
    }
  }
}
