import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product.component';
import { AddProductRoutingModule } from './add-product-routing.module';
// 公用组件
import { HeadTextModule } from '../../../common/head-text/head-text.module';
import { SharedModule } from '../../../shared/share.module';
import { ManualModelConfigComponent } from './manual-model-config/manual-model-config.component';
import { ManualModelBtnListComponent } from './manual-model-btn-list/manual-model-btn-list.component';
import { ManualModelModalComponent } from './manual-model-modal/manual-model-modal.component';

@NgModule({
  imports: [
    CommonModule,
    AddProductRoutingModule,
    HeadTextModule,
    SharedModule,
  ],
  declarations: [
    AddProductComponent,
    ManualModelConfigComponent,
    ManualModelBtnListComponent,
    ManualModelModalComponent,
  ],
  exports: [
    ManualModelBtnListComponent,
    ManualModelConfigComponent,
    ManualModelModalComponent,
  ],
})
export class AddProductModule {}
