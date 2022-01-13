import { NgModule } from '@angular/core';
import { ProductCenterComponent } from './product-center.component';
import { SharedModule } from '../../shared/share.module';
import { HeadTextModule } from '../../common/head-text/head-text.module';
import { ProductCenterRoutingModule } from './product-center-routing.module';

@NgModule({
  imports: [SharedModule, ProductCenterRoutingModule, HeadTextModule],
  declarations: [ProductCenterComponent],
})
export class ProductCenterModule {}
