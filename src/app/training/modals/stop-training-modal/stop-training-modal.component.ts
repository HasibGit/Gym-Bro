import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training-modal',
  templateUrl: './stop-training-modal.component.html',
  styleUrls: ['./stop-training-modal.component.scss'],
})
export class StopTrainingModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public progress: number) {}

  ngOnInit(): void {}
}
