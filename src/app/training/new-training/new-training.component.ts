import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  workouts: Exercise[];
  muscleGroups: string[];
  startTrainingForm: FormGroup;
  selectWorkoutControl: FormControl = new FormControl('', Validators.required);
  chosenExercise: Exercise;
  isLoading: boolean;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private trainingService: TrainingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initTrainingForm();
    this.isLoading = true;
    this.trainingService
      .getMuscleGroups()
      .pipe(take(1))
      .subscribe((res: string[]) => {
        this.muscleGroups = res;
      });

    this.trainingService
      .fetchExercises()
      .pipe(take(1))
      .subscribe((res) => {
        this.workouts = res;
        this.isLoading = false;
      });
  }

  initTrainingForm() {
    this.startTrainingForm = this.fb.group({
      muscleGroup: ['', Validators.required],
      workout: ['', Validators.required],
    });
  }

  onStartTraining() {
    this.chosenExercise = this.workouts.find(
      (workout: Exercise) =>
        workout.id === this.startTrainingForm.get('workout').value
    );
    if (this.chosenExercise) {
      this.trainingService.setCurrentExercise(this.chosenExercise);
      this.newTrainingStarted.emit(true);
    }
  }
}
