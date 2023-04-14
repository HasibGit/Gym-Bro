import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { take } from 'rxjs';
import { HelperService } from '../../shared/services/helper.service';
import * as fromTraining from '../state/training.reducer';
import { Store } from '@ngrx/store';
import { SetPastExercises } from '../state/training.actions';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss'],
  providers: [MatSort],
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = [
    'date',
    'Name',
    'Primary Muscles',
    'Sets',
    'SetDuration',
    'status',
  ];
  dataSource = new MatTableDataSource<Exercise>();

  constructor(
    private _trainingService: TrainingService,
    private _helperService: HelperService,
    private _cdr: ChangeDetectorRef,
    private _store: Store<fromTraining.TrainingState>
  ) {}

  ngOnInit(): void {
    this._helperService
      .getLoggedInUserId()
      .pipe(take(1))
      .subscribe((userId) => {
        this._trainingService
          .getPastExercises(userId)
          .pipe(take(1))
          .subscribe((exercises: Exercise[]) => {
            this._store.dispatch(new SetPastExercises(exercises));
            this.dataSource.data = exercises;
          });
      });
  }

  ngAfterViewInit(): void {
    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this._cdr.detectChanges();
  }

  filterData(event: KeyboardEvent) {
    this.dataSource.filter = (<HTMLInputElement>event.target).value
      .trim()
      .toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
