import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../shared/services/helper.service';
import { TrainingService } from '../../training/services/training.service';
import { Observable, take } from 'rxjs';
import { Schedule } from '../interfaces/schedule.interface';
import { Exercise } from '../../training/interfaces/exercise.interface';
import { Router } from '@angular/router';
import * as fromRoot from '../../state/app/app.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../../shared/state/ui.actions';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.scss'],
})
export class MyScheduleComponent implements OnInit {
  isLoading$: Observable<boolean>;
  todaysSchedule: Exercise[] = [];
  today = new Date();
  dayName: string;
  noWorkoutsScheduled: boolean;
  selectedExercise: Exercise;

  constructor(
    private _helperService: HelperService,
    private _trainingService: TrainingService,
    private _router: Router,
    private _store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._store.select(fromRoot.getIsLoading);
    this._store.dispatch(new UI.StartLoading());
    this.getDayName();
    this._helperService
      .getLoggedInUserId()
      .pipe(take(1))
      .subscribe((userId: string) => {
        this._trainingService
          .getMySchedule(userId)
          .pipe(take(1))
          .subscribe((schedules: Schedule[]) => {
            if ((schedules[0]?.[this.dayName] as Exercise[]).length > 0) {
              this.todaysSchedule = schedules[0][this.dayName];
            } else {
              this.noWorkoutsScheduled = true;
            }

            this._store.dispatch(new UI.StopLoading());
          });
      });
  }

  getDayName() {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    this.dayName = this.today.toLocaleString('en-US', options);
  }

  onSelectExercise(exercise: Exercise) {
    this.selectedExercise = exercise;
  }

  startExercise() {
    this._trainingService.setCurrentExercise(this.selectedExercise);
    this._trainingService.exerciseChanged.next(this.selectedExercise);
    this._trainingService.startScheduleWorkout();
    this._router.navigate(['/training']);
  }
}
