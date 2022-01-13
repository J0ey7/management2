import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportDetailComponent } from './import-detail.component';
import { HeadTextModule } from '../../../common/head-text/head-text.module';
const routes: Routes = [{ path: '', component: ImportDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), HeadTextModule],
  exports: [RouterModule],
})
export class ImportDetailRoutingModule {}
