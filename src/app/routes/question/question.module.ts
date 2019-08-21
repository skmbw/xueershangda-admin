import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { QuestionRoutingModule } from './question-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    QuestionRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class QuestionModule { }
