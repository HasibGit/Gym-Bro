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
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as fromRoot from '../../state/app/app.reducer';
import * as UI from '../../shared/state/ui.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  workouts: Exercise[];
  muscleGroups: string[];
  startTrainingForm: FormGroup;
  chosenExercise: Exercise;
  isLoading$: Observable<boolean>;
  unsubscribeAll: Subject<void>;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private trainingService: TrainingService,
    private fb: FormBuilder,
    public _dialog: MatDialog,
    private store: Store<fromRoot.State>
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.initTrainingForm();
    
    this.store.dispatch(new UI.StartLoading());

    this.trainingService
      .getMuscleGroups()
      .pipe(take(1))
      .subscribe((res: string[]) => {
        this.muscleGroups = res;
        this.store.dispatch(new UI.StopLoading());
      });

    this.startTrainingForm
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
    this.startTrainingForm = this.fb.group({
      muscleGroup: ['', Validators.required],
      workout: ['', Validators.required],
      sets: ['', Validators.required],
      setDuration: ['', Validators.required],
      break: ['', Validators.required],
    });
  }

  workoutSelected(): boolean {
    return this.startTrainingForm.get('workout').value;
  }

  isWorkoutDisabled(): boolean {
    return !this.startTrainingForm.get('muscleGroup').value;
  }

  onStartTraining() {
    const formData: {
      break: number;
      muscleGroup: string;
      setDuration: number;
      sets: number;
      workout: string;
    } = this.startTrainingForm.getRawValue();

    this.chosenExercise = this.workouts.find(
      (workout: Exercise) =>
        workout.Name === this.startTrainingForm.get('workout').value
    );

    this.chosenExercise.Sets = formData.sets;
    this.chosenExercise.SetDuration = formData.setDuration;
    this.chosenExercise.Break = formData.break;

    if (this.chosenExercise) {
      this.trainingService.setCurrentExercise(this.chosenExercise);
      this.newTrainingStarted.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
