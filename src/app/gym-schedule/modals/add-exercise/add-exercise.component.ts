import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { Exercise } from '../../../training/interfaces/exercise.interface';
import { TrainingService } from '../../../training/services/training.service';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss'],
})
export class AddExerciseComponent implements OnInit, OnDestroy {
  workouts: Exercise[];
  muscleGroups: string[];
  addTrainingForm: FormGroup;
  chosenExercise: Exercise;
  isLoading: boolean;
  unsubscribeAll: Subject<void>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public day: string,
    private _dialogRef: MatDialogRef<AddExerciseComponent>,
    private _fb: FormBuilder,
    private trainingService: TrainingService
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.initTrainingForm();
    this.isLoading = true;

    this.trainingService
      .getMuscleGroups()
      .pipe(take(1))
      .subscribe((res: string[]) => {
        this.muscleGroups = res;
        this.isLoading = false;
      });

    this.addTrainingForm
      .get('muscleGroup')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((muscleGroup: string) => {
        this.trainingService
          .getExercisesBasedOnMuscleGroup(muscleGroup)
          .pipe(take(1))
          .subscribe((exercises: Exercise[]) => {
            this.workouts = exercises;
          });
      });
  }

  initTrainingForm() {
    this.addTrainingForm = this._fb.group({
      muscleGroup: ['', Validators.required],
      workout: ['', Validators.required],
      sets: ['', Validators.required],
      setDuration: ['', Validators.required],
      break: ['', Validators.required],
    });
  }

  workoutSelected(): boolean {
    return this.addTrainingForm.get('workout').value;
  }

  isWorkoutDisabled(): boolean {
    return !this.addTrainingForm.get('muscleGroup').value;
  }

  addExercise() {
    const formData: {
      break: number;
      muscleGroup: string;
      setDuration: number;
      sets: number;
      workout: string;
    } = this.addTrainingForm.getRawValue();
    this.chosenExercise = this.workouts.find(
      (workout: Exercise) =>
        workout.Name === this.addTrainingForm.get('workout').value
    );
    this.chosenExercise.Sets = formData.sets;
    this.chosenExercise.SetDuration = formData.setDuration;
    this.chosenExercise.Break = formData.break;

    this._dialogRef.close(this.chosenExercise);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
