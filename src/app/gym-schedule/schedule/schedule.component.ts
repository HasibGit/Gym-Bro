import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { WEEKDAYS } from '../constants/days.const';
import { AddExerciseComponent } from '../modals/add-exercise/add-exercise.component';
import { Observable, shareReplay, switchMap, take } from 'rxjs';
import { Exercise } from '../../training/interfaces/exercise.interface';
import { INITIAL_SCHEDULE } from '../constants/schedule.const';
import { Schedule } from '../interfaces/schedule.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TrainingService } from '../../training/services/training.service';
import { HelperService } from '../../shared/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromRoot from '../../state/app/app.reducer';
import * as UI from '../../shared/state/ui.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  weekDays = WEEKDAYS;
  schedule: Schedule = { ...INITIAL_SCHEDULE };
  muscleGroups: string[];
  isLoading$: Observable<boolean>;
  hasPriorSchedule: boolean;
  isSaving: boolean;
  scheduleEditCounter: number = 0;

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<AddExerciseComponent>,
    private _trainingService: TrainingService,
    private _helperService: HelperService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.store.dispatch(new UI.StartLoading());
    const userIdObs$ = this._helperService.getLoggedInUserId().pipe(take(1));
    const myScheduleObs$ = userIdObs$.pipe(
      take(1),
      shareReplay(1),
      switchMap((userId: string) => {
        return this._trainingService.getMySchedule(userId);
      })
    );

    this._trainingService
      .getMuscleGroups()
      .pipe(take(1))
      .subscribe((res: string[]) => {
        this.muscleGroups = res;
        myScheduleObs$
          .pipe(take(1), shareReplay(1))
          .subscribe((schedules: Schedule[]) => {
            if (schedules.length > 0) {
              this.schedule = schedules[0];
              this.hasPriorSchedule = true;
            }
            this.store.dispatch(new UI.StopLoading());
          });
      });
  }

  addExercise(day: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.width = '600px';
    dialogConfig.data = { day: day, muscleGroups: this.muscleGroups };
    this._dialogRef = this._dialog.open(AddExerciseComponent, dialogConfig);

    this._dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        if (exercise) {
          this.schedule[day].push(exercise);
          this.scheduleEditCounter++;
        }
      });
  }

  removeExercise(day: string, index: number) {
    (this.schedule[day] as Exercise[]).splice(index);
    this.scheduleEditCounter--;
  }

  drop(event: CdkDragDrop<Exercise[]>, day: string) {
    moveItemInArray(
      this.schedule[day],
      event.previousIndex,
      event.currentIndex
    );
  }

  saveSchedule() {
    this.isSaving = true;
    this._trainingService
      .saveSchedule(this.schedule)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this._helperService.openSnackBar('Schedule saved successfully!');
          this.isSaving = false;
          this.router.navigate(['my-schedule'], { relativeTo: this.route });
        },
        (error) => {
          this._helperService.openSnackBar('Sorry, something went wrong.');
        }
      );
  }
}
