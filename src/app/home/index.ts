// Type 表示组件类型
import { Type } from '@angular/core';
// 商品手册页
import { ProductComponent } from './product/product.component';
// 产品中心页
import { ProductCenterComponent } from './product-center/product-center.component';
// 新增产品页
import { AddProductComponent } from './product/add-product/add-product.component';
//产品编辑页
import { EditProductComponent } from './product/edit-product/edit-product.component';
//产品详情页
import { DetailComponent } from './product/detail/detail.component';
// 产品中心详情页
import { ImportDetailComponent } from './product-center/import-detail/import-detail.component';
// 产品中心编辑页
import { IncomingEditorComponent } from './product-center/Incoming-editor/Incoming-editor.component';
// 产品入库
import { ImportStorageComponent } from './product-center/import-storage/import-storage.component';
import { HandleTableTplComponent } from '../shared/components/handle-table-tpl/handle-table-tpl.component';

// 创建动态组件数据模型
export interface DynamicComponent {
  name: string;
  component: Type<any>;
  title: string;
  closeable?: boolean;
}

export const DYNAMIC_COMPONENTS: Array<DynamicComponent> = [
  {
    name: 'ProductComponent',
    component: ProductComponent,
    title: '产品手册',
  },
  {
    name: 'ProductDetailComponent',
    component: DetailComponent,
    title: '手册详细',
  },
  {
    name: 'ProductCenterComponent',
    component: ProductCenterComponent,
    title: '产品中心',
  },

  {
    name: 'AddProductComponent',
    component: AddProductComponent,
    title: '新增手册',
  },

  {
    name: 'EditProductComponent',
    component: EditProductComponent,
    title: '手册编辑',
  },

  {
    name: 'ImportDetailComponent',
    component: ImportDetailComponent,
    title: '产品详情',
  },

  {
    name: 'IncomingEditorComponent',
    component: IncomingEditorComponent,
    title: '产品编辑',
  },
  {
    name: 'ImportStorageComponent',
    component: ImportStorageComponent,
    title: '产品入库',
  },
];
