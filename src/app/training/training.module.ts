import { NgModule } from '@angular/core';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { StopTrainingModalComponent } from './modals/stop-training-modal/stop-training-modal.component';
import { TrainingComponent } from './training.component';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';
import { StoreModule } from '@ngrx/store';
import { trainingReducer } from './state/training.reducer';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    StopTrainingModalComponent,
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule,
    StoreModule.forFeature('training', trainingReducer),
  ],
  entryComponents: [StopTrainingModalComponent],
})
export class TrainingModule {}
