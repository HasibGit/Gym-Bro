import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, take, map, Subscription } from 'rxjs';
import { COLLECTIONS } from '../../shared/constants/collections.const';
import { HTTP_COMMON_HEADER } from '../../shared/constants/http-options.const';
import { Exercise } from '../interfaces/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private pastExercises: Exercise[] = [];

  public exerciseChanged: Subject<Exercise> = new Subject();

  private currentExercise: Exercise;

  constructor(private _afs: AngularFirestore, private _http: HttpClient) {}

  getMuscleGroups(): Observable<string[]> {
    return this._http.get<string[]>(
      'https://exerciseapi3.p.rapidapi.com/search/muscles/',
      HTTP_COMMON_HEADER
    );
  }

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

  fetchPastExercises(): Observable<Exercise[]> {
    return this._afs
      .collection<any>(COLLECTIONS.past_exercises)
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
    this.pushPastExerciseDataToDatabase({
      ...this.currentExercise,
      date: new Date(),
      status: 'completed',
    });
    this.currentExercise = null;
    this.exerciseChanged.next(this.currentExercise);
  }

  cancelExercise(progress: number) {
    this.pushPastExerciseDataToDatabase({
      ...this.currentExercise,
      duration: (this.currentExercise.duration * progress) / 100,
      calories: (this.currentExercise.calories * progress) / 100,
      date: new Date(),
      status: 'cancelled',
    });
    this.currentExercise = null;
    this.exerciseChanged.next(this.currentExercise);
  }

  pushPastExerciseDataToDatabase(exercise: Exercise) {
    this._afs.collection(COLLECTIONS.past_exercises).add(exercise);
  }

  getPastExercises() {
    return this.fetchPastExercises();
  }
}
