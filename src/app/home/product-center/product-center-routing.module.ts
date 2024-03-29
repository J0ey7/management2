import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCenterComponent } from './product-center.component';

const routes: Routes = [{ path: '', component: ProductCenterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCenterRoutingModule {}
