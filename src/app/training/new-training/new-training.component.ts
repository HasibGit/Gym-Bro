import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  workoutsObs$: Observable<Exercise[]>;
  workouts: Exercise[];
  selectWorkoutControl: FormControl = new FormControl('', Validators.required);
  chosenExercise: Exercise;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private trainingService: TrainingService,
    private _db: Firestore
  ) {
    const data = collection(_db, 'exercises');
    this.workoutsObs$ = collectionData(data) as Observable<Exercise[]>;
    this.workoutsObs$.pipe(take(1)).subscribe((exercises) => {
      console.log(exercises);
      this.workouts = exercises;
    });
  }

  ngOnInit(): void {}

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
