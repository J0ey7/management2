import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { HeadTextModule } from '../../common/head-text/head-text.module';
import { SharedModule } from '../../shared/share.module';

@NgModule({
  imports: [ProductRoutingModule, HeadTextModule, SharedModule],
  declarations: [ProductComponent],
})
export class ProductModule {}
