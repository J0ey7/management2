import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomingEditorComponent } from './Incoming-editor.component';
const routes: Routes = [{ path: '', component: IncomingEditorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingEditorRoutingModule {}
