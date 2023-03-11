import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StopTrainingModalComponent } from '../modals/stop-training-modal/stop-training-modal.component';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit {
  @Output() exitTraining: EventEmitter<boolean> = new EventEmitter();
  progress = 0;

  timer: NodeJS.Timer;

  constructor(
    public _dialog: MatDialog,
    private _trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    this.timer = setInterval(() => {
      this.progress += 5;
      if (this.progress === 100) {
        this.progress = 0;
        clearInterval(this.timer);
      }
    }, 1000);
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
        this.exitTraining.emit(true);
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
