import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/share.module';
// import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import { DetailRoutingModule } from './detail-routing.module';
// 头部公用组件
import { HeadTextModule } from '../../../common/head-text/head-text.module';
import { AddProductModule } from '../add-product/add-product.module';
// 共享模块

// 库的组件
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzMenuModule } from 'ng-zorro-antd/menu';
// import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
// import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  imports: [
    DetailRoutingModule,
    HeadTextModule,
    SharedModule,
    AddProductModule,
  ],
  declarations: [DetailComponent],
})
export class DetailModule {}
