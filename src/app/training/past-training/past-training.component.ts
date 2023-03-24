import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.scss'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['date', 'name', 'duration', 'calories', 'status'];
  dataSource = new MatTableDataSource<Exercise>();

  constructor(private _trainingService: TrainingService) {}

  ngOnInit(): void {
    this.dataSource.data = this._trainingService.getPastExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
