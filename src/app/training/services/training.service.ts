import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, take, map } from 'rxjs';
import { COLLECTIONS } from '../../shared/constants/collections.const';
import { Exercise } from '../interfaces/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private pastExercises: Exercise[] = [];

  public exerciseChanged: Subject<Exercise> = new Subject();

  private currentExercise: Exercise;

  constructor(private _afs: AngularFirestore) {}

  fetchExercises(): Observable<Exercise[]> {
    return this._afs
      .collection<any>(COLLECTIONS.exercises)
      .snapshotChanges()
      .pipe(
        take(1),
        map((docArray: any[]) => {
          return docArray.map((doc) => {
            return { id: doc.payload.doc.id, ...doc.payload.doc.data() };
          });
        })
      );
  }

  setCurrentExercise(exercise: Exercise) {
    this.currentExercise = exercise;
  }

  getCurrentExercise() {
    return this.currentExercise;
  }

  completeExercise() {
    this.pastExercises.push({
      ...this.currentExercise,
      date: new Date(),
      status: 'completed',
    });
    this.currentExercise = null;
    this.exerciseChanged.next(this.currentExercise);
  }

  cancelExercise(progress: number) {
    this.pastExercises.push({
      ...this.currentExercise,
      duration: (this.currentExercise.duration * progress) / 100,
      calories: (this.currentExercise.calories * progress) / 100,
      date: new Date(),
      status: 'cancelled',
    });
    this.currentExercise = null;
    this.exerciseChanged.next(this.currentExercise);
  }

  getPastExercises() {
    return this.pastExercises;
  }
}
