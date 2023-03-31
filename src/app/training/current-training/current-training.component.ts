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
  intervalOngoing: boolean;

  timer: NodeJS.Timer;

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
          this._trainingService.completeExercise();
          clearInterval(this.timer);
        } else {
          this.progress = 0;
        }
      }
    }, stepSize);
  }

  pauseTraining() {
    clearInterval(this.timer);
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
        this.startOrResumeTraining();
      }
    });
  }

  getDialogConfig(config: MatDialogConfig) {
    config.autoFocus = true;
    config.disableClose = true;
    config.width = '400px';
    config.data = this.progress;
  }
}
