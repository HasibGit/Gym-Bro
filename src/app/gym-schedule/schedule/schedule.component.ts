import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { WEEKDAYS } from '../constants/days.const';
import { AddExerciseComponent } from '../modals/add-exercise/add-exercise.component';
import { take } from 'rxjs';
import { Exercise } from '../../training/interfaces/exercise.interface';
import { INITIAL_SCHEDULE } from '../constants/schedule.const';
import { Schedule } from '../interfaces/schedule.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  weekDays = WEEKDAYS;
  schedule: Schedule = INITIAL_SCHEDULE;

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<AddExerciseComponent>
  ) {}

  ngOnInit(): void {}

  addExercise(day: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;
    dialogConfig.width = '600px';
    dialogConfig.data = day;
    this._dialogRef = this._dialog.open(AddExerciseComponent, dialogConfig);

    this._dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((exercise: Exercise) => {
        this.schedule[day].push(exercise);
        console.log(this.schedule);
      });
  }

  removeExercise(day: string, index: number) {
    (this.schedule[day] as Exercise[]).splice(index);
  }

  // drop(event: CdkDragDrop<Exercise[]>, day: string) {
  //   moveItemInArray(
  //     this.schedule[day],
  //     event.previousIndex,
  //     event.currentIndex
  //   );
  // }
}
