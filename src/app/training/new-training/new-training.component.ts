import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Exercise, Exercise2 } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  workouts: Exercise2[];
  muscleGroups: string[];
  startTrainingForm: FormGroup;
  chosenExercise: Exercise2;
  isLoading: boolean;
  unsubscribeAll: Subject<void>;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private trainingService: TrainingService,
    private fb: FormBuilder
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

    // this.trainingService
    //   .fetchExercises()
    //   .pipe(take(1))
    //   .subscribe((res) => {
    //     this.workouts = res;
    //     this.isLoading = false;
    //   });

    this.startTrainingForm
      .get('muscleGroup')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe((muscleGroup: string) => {
        this.trainingService
          .getExercisesBasedOnMuscleGroup(muscleGroup)
          .pipe(take(1))
          .subscribe((exercises: Exercise2[]) => {
            this.workouts = exercises;
          });
      });
  }

  initTrainingForm() {
    this.startTrainingForm = this.fb.group({
      muscleGroup: ['', Validators.required],
      workout: ['', Validators.required],
    });
  }

  isWorkoutDisabled(): boolean {
    return !this.startTrainingForm.get('muscleGroup').value;
  }

  onStartTraining() {
    // this.chosenExercise = this.workouts.find(
    //   (workout: Exercise) =>
    //     workout.id === this.startTrainingForm.get('workout').value
    // );
    // if (this.chosenExercise) {
    //   this.trainingService.setCurrentExercise(this.chosenExercise);
    //   this.newTrainingStarted.emit(true);
    // }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
