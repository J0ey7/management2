import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/share.module';
import { ImportStorageComponent } from './import-storage.component';
import { ImportStorageRoutingModule } from './import-storage-routing.module';
import { HeadTextModule } from '../../../common/head-text/head-text.module';

@NgModule({
  imports: [SharedModule, ImportStorageRoutingModule, HeadTextModule],
  declarations: [ImportStorageComponent],
})
export class ImportStorageModule {}
