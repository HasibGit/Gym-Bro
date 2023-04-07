import { NgModule } from '@angular/core';
import { ScheduleComponent } from './schedule/schedule.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddExerciseComponent } from './modals/add-exercise/add-exercise.component';

const routes: Route[] = [
  {
    path: '',
    component: ScheduleComponent,
  },
];

@NgModule({
  declarations: [ScheduleComponent, AddExerciseComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  entryComponents: [AddExerciseComponent],
})
export class GymScheduleModule {}
