import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StopTrainingModalComponent } from '../modals/stop-training-modal/stop-training-modal.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss'],
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;

  constructor(public _dialog: MatDialog) {}

  ngOnInit(): void {
    const timer = setInterval(() => {
      this.progress += 5;
      if (this.progress === 100) {
        this.progress = 0;
        clearInterval(timer);
      }
    }, 1000);
  }

  stopTraining() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    const dialogRef = this._dialog.open(
      StopTrainingModalComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res?.exitTraining) {
        console.log('Training stopped');
      }
    });
  }
}
