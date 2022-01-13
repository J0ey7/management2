import { NgModule } from '@angular/core';
import { EditProductComponent } from './edit-product.component';
import { SharedModule } from '../../../shared/share.module';
import { HeadTextModule } from '../../../common/head-text/head-text.module';
import { EditProductRoutingModule } from './edit-product-routing.module';
import { AddProductModule } from '../add-product/add-product.module';

@NgModule({
  imports: [
    SharedModule,
    EditProductRoutingModule,
    HeadTextModule,
    AddProductModule,
  ],
  declarations: [EditProductComponent],
})
export class EditProductModule {}
