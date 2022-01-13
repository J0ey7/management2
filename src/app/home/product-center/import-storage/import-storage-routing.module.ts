import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportStorageComponent } from './import-storage.component';

const routes: Routes = [{ path: '', component: ImportStorageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportStorageRoutingModule {}
