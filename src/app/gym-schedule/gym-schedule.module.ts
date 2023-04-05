import { NgModule } from '@angular/core';
import { ScheduleComponent } from './schedule/schedule.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Route[] = [
  {
    path: '',
    component: ScheduleComponent,
  },
];

@NgModule({
  declarations: [ScheduleComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class GymScheduleModule {}
