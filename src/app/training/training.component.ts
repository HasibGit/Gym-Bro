import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Exercise } from './interfaces/exercise.interface';
import { TrainingService } from './services/training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  _unsubscribeAll: Subject<void>;

  constructor(
    private _trainingService: TrainingService,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    if (this._trainingService.getCurrentExercise()) {
      this.ongoingTraining = true;
    }
    this._trainingService.exerciseChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((exercise: Exercise) => {
        if (exercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = null;
          if (this._trainingService.isScheduleWorkoutOngoing()) {
            this._trainingService.endScheduleWorkout();
            this._router.navigate(['schedule/my-schedule']);
          }
        }

        exercise
          ? (this.ongoingTraining = true)
          : (this.ongoingTraining = null);
      });
  }

  onNewTrainingStart() {
    this.ongoingTraining = true;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
