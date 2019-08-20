import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { VideoRoutingModule } from './video-routing.module';
import { VideoListComponent } from './list/list.component';
import { VideoEditComponent } from './edit/edit.component';

const COMPONENTS = [
  VideoListComponent];
const COMPONENTS_NOROUNT = [
  VideoEditComponent];

@NgModule({
  imports: [
    SharedModule,
    VideoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class VideoModule { }
