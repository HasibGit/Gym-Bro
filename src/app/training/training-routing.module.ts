import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TrainingComponent } from './training.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Route[] = [
  {
    path: '',
    component: TrainingComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
