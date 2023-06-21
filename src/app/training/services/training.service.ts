import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, take, map, Subscription, switchMap } from 'rxjs';
import { Schedule } from '../../gym-schedule/interfaces/schedule.interface';
import { COLLECTIONS } from '../../shared/constants/collections.const';
import { HTTP_COMMON_HEADER } from '../../shared/constants/http-options.const';
import { HelperService } from '../../shared/services/helper.service';
import { Exercise } from '../interfaces/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public exerciseChanged: Subject<Exercise> = new Subject();

  private currentExercise: Exercise;

  private scheduleWorkoutOngoing: boolean;

  constructor(
    private _afs: AngularFirestore,
    private _http: HttpClient,
    private _helperService: HelperService
  ) {}

  startScheduleWorkout() {
    this.scheduleWorkoutOngoing = true;
  }

  endScheduleWorkout() {
    this.scheduleWorkoutOngoing = false;
  }

  isScheduleWorkoutOngoing() {
    return this.scheduleWorkoutOngoing;
  }

  getMuscleGroups(): Observable<{ id: string; name: string }[]> {
    return this._afs
      .collection<any>(COLLECTIONS.muscleGroups)
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

  getExercisesBasedOnMuscleGroup(muscleGroup: string): Observable<Exercise[]> {
    return this._afs
      .collection<any>(COLLECTIONS.exercises, (ref) =>
        ref.where('PrimaryMuscle', '==', muscleGroup)
      )
      .valueChanges()
      .pipe(take(1));
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

  cancelExercise(progress: number, numberOfSetsCompleted: number) {
    this._helperService
      .getLoggedInUserId()
      .pipe(take(1))
      .subscribe((userId) => {
        if (userId) {
          this.pushPastExerciseDataToDatabase({
            ...this.currentExercise,
            Sets: numberOfSetsCompleted,
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

  upsertScheduleDataToDatabase(schedule: Schedule): Promise<any> {
    return this._afs
      .collection(COLLECTIONS.schedules)
      .doc(schedule.userId)
      .set(schedule);
  }

  saveSchedule(schedule: Schedule): Observable<any> {
    return this._helperService.getLoggedInUserId().pipe(
      take(1),
      switchMap((userId: string) => {
        return this.upsertScheduleDataToDatabase({
          ...schedule,
          userId: userId,
        });
      })
    );
  }

  getPastExercises(userId: string) {
    return this.fetchPastExercises(userId);
  }

  fetchMySchedule(userId: string): Observable<Schedule> {
    return this._afs
      .collection<any>(COLLECTIONS.schedules)
      .doc(userId)
      .valueChanges()
      .pipe(take(1));
  }

  getMySchedule(userId: string): Observable<Schedule> {
    return this.fetchMySchedule(userId);
  }
}
