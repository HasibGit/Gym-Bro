import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Exercise } from '../interfaces/exercise.interface';
import { TrainingService } from '../services/training.service';
import { map, take } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss'],
})
export class NewTrainingComponent implements OnInit {
  exercisesCollection: AngularFirestoreCollection<any>;
  workouts: Exercise[];
  selectWorkoutControl: FormControl = new FormControl('', Validators.required);
  chosenExercise: Exercise;
  isLoading: boolean;
  @Output() newTrainingStarted: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private trainingService: TrainingService,
    private _afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.fetchExercises();
  }

  private fetchExercises(): void {
    this.isLoading = true;
    this.exercisesCollection = this._afs.collection<any>('exercises');
    this.exercisesCollection
      .snapshotChanges()
      .pipe(
        take(1),
        map((docArray: any[]) => {
          return docArray.map((doc) => {
            return { id: doc.payload.doc.id, ...doc.payload.doc.data() };
          });
        })
      )
      .subscribe((result) => {
        this.workouts = result;
        this.isLoading = false;
      });
  }

  onStartTraining() {
    this.chosenExercise = this.workouts.find(
      (workout: Exercise) => workout.id === this.selectWorkoutControl.value
    );
    if (this.chosenExercise) {
      this.trainingService.setCurrentExercise(this.chosenExercise);
      this.newTrainingStarted.emit(true);
    }
  }
}
