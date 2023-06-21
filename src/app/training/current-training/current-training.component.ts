import { Component, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Exercise } from '../interfaces/exercise.interface';
import { StopTrainingModalComponent } from '../modals/stop-training-modal/stop-training-modal.component';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  currentExercise: Exercise;
  userId: string;
  numberOfSetsCompleted = 0;
  interval: number;
  intervalOngoing = false;

  timer: NodeJS.Timer;
  intervalTimer: NodeJS.Timer;
  intervalProgress = 0;

  constructor(
    public _dialog: MatDialog,
    private _trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.currentExercise = this._trainingService.getCurrentExercise();
    this.interval = this.currentExercise.Break;
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    const stepSize = (this.currentExercise.SetDuration * 1000) / 100;
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress === 100) {
        this.numberOfSetsCompleted++;
        if (this.numberOfSetsCompleted === this.currentExercise.Sets) {
          clearInterval(this.timer);
          this._trainingService.completeExercise();
        } else {
          this.progress = 0;
          clearInterval(this.timer); // clear outer interval while inner interval is running
          this.initiateBreakTime();
        }
      }
    }, stepSize);
  }

  initiateBreakTime() {
    const intervalStepSize = (this.currentExercise.Break * 1000) / 100;
    this.intervalTimer = setInterval(() => {
      this.intervalOngoing = true;
      this.intervalProgress++;
      if (this.intervalProgress === 100) {
        this.intervalProgress = 0;
        this.intervalOngoing = false;
        clearInterval(this.intervalTimer);
        this.startOrResumeTraining(); // start the next set
      }
    }, intervalStepSize);
  }

  pauseTraining() {
    clearInterval(this.timer);
    clearInterval(this.intervalTimer);
  }

  stopTraining() {
    this.pauseTraining();
    const dialogConfig = new MatDialogConfig();
    this.getDialogConfig(dialogConfig);
    const dialogRef = this._dialog.open(
      StopTrainingModalComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res?.exitTraining) {
        this._trainingService.cancelExercise(
          this.progress,
          this.numberOfSetsCompleted
        );
      } else {
        if (this.intervalOngoing) {
          this.initiateBreakTime();
        } else {
          this.startOrResumeTraining();
        }
      }
    });
  }

  getDialogConfig(config: MatDialogConfig) {
    config.autoFocus = true;
    config.disableClose = true;
    config.width = '400px';
    config.data = {
      progress: this.progress,
      currentSet: this.numberOfSetsCompleted + 1,
      intervalOngoing: this.intervalOngoing,
    };
  }
}
