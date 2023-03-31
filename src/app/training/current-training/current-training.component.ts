import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  timer: NodeJS.Timer;

  constructor(
    public _dialog: MatDialog,
    private _trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.currentExercise = this._trainingService.getCurrentExercise();
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    const stepSize = (this.currentExercise.SetDuration * 1000) / 100;
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress === 100) {
        this._trainingService.completeExercise();
        this.progress = 0;
        clearInterval(this.timer);
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
        this._trainingService.cancelExercise(this.progress);
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
