import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, take, map, Subscription } from 'rxjs';
import { COLLECTIONS } from '../../shared/constants/collections.const';
import { HTTP_COMMON_HEADER } from '../../shared/constants/http-options.const';
import { HelperService } from '../../shared/services/helper.service';
import { Exercise } from '../interfaces/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private pastExercises: Exercise[] = [];

  public exerciseChanged: Subject<Exercise> = new Subject();

  private currentExercise: Exercise;

  constructor(
    private _afs: AngularFirestore,
    private _http: HttpClient,
    private _helperService: HelperService
  ) {}

  getMuscleGroups(): Observable<string[]> {
    return this._http.get<string[]>(
      'https://exerciseapi3.p.rapidapi.com/search/muscles/',
      HTTP_COMMON_HEADER
    );
  }

  getExercisesBasedOnMuscleGroup(muscleGroup: string): Observable<Exercise[]> {
    return this._http.get<Exercise[]>(
      'https://exerciseapi3.p.rapidapi.com/search/',
      {
        ...HTTP_COMMON_HEADER,
        params: new HttpParams().set('primaryMuscle', muscleGroup),
      }
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

  fetchPastExercises(userId: string): Observable<any[]> {
    return this._afs
      .collection<any>(COLLECTIONS.past_exercises, (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(take(1));
  }

  setCurrentExercise(exercise: Exercise) {
    this.currentExercise = exercise;
  }

  getCurrentExercise() {
    return this.currentExercise;
  }

  completeExercise() {
    this._helperService
      .getLoggedInUserId()
      .pipe(take(1))
      .subscribe((userId) => {
        if (userId) {
          this.pushPastExerciseDataToDatabase({
            ...this.currentExercise,
            userId: userId,
            date: new Date(),
            status: 'completed',
          })
            .then((docRef) => {
              this.currentExercise = null;
              this.exerciseChanged.next(this.currentExercise);
            })
            .catch((error) => {
              this._helperService.openSnackBar('Sorry, something went wrong');
            });
        }
      });
  }

  cancelExercise(progress: number) {
    this._helperService
      .getLoggedInUserId()
      .pipe(take(1))
      .subscribe((userId) => {
        if (userId) {
          this.pushPastExerciseDataToDatabase({
            ...this.currentExercise,
            userId: userId,
            date: new Date(),
            status: 'cancelled',
          })
            .then(() => {
              this.currentExercise = null;
              this.exerciseChanged.next(this.currentExercise);
            })
            .catch((error) => {
              this._helperService.openSnackBar('Sorry, something went wrong');
            });
        }
      });
  }

  pushPastExerciseDataToDatabase(exercise: Exercise) {
    return this._afs.collection(COLLECTIONS.past_exercises).add(exercise);
  }

  getPastExercises(userId: string) {
    return this.fetchPastExercises(userId);
  }
}
