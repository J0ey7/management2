import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/share.module';
import { HeadTextModule } from '../../../common/head-text/head-text.module';
import { IncomingEditorComponent } from './Incoming-editor.component';
import { IncomingEditorRoutingModule } from './incoming-editor-routing.module';

@NgModule({
  imports: [SharedModule, IncomingEditorRoutingModule, HeadTextModule],
  declarations: [IncomingEditorComponent],
})
export class IncomingEditorModule {}
