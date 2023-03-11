import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private _trainingService: TrainingService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._trainingService.exerciseChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((exercise: Exercise) => {
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
