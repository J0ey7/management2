import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/share.module';
import { ImportDetailComponent } from './import-detail.component';
import { ImportDetailRoutingModule } from './import-detail-routing.module';
import { HeadTextModule } from '../../../common/head-text/head-text.module';

@NgModule({
  imports: [SharedModule, ImportDetailRoutingModule, HeadTextModule],
  declarations: [ImportDetailComponent],
})
export class ImportDetailModule {}
