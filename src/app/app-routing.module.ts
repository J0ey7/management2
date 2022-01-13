import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product',
        loadChildren: () =>
          import('./home/product/product.module').then((m) => m.ProductModule),
      },
      {
        path: 'detail/:id',
        loadChildren: () =>
          import('./home/product/detail/detail.module').then(
            (m) => m.DetailModule
          ),
      },
      {
        path: 'addProduct',
        loadChildren: () =>
          import('./home/product/add-product/add-product.module').then(
            (m) => m.AddProductModule
          ),
      },
      {
        path: 'editProduct',
        loadChildren: () =>
          import('./home/product/edit-product/edit-product.module').then(
            (m) => m.EditProductModule
          ),
      },
      {
        path: 'productCenter',
        loadChildren: () =>
          import('./home/product-center/product-center.module').then(
            (m) => m.ProductCenterModule
          ),
      },
      // {
      //   path: '',
      //   redirectTo: 'product',
      //   pathMatch: 'full',
      // },
      {
        path: 'importStorage',
        loadChildren: () =>
          import(
            './home/product-center/import-storage/import-storage.module'
          ).then((m) => m.ImportStorageModule),
      },
      {
        path: 'incomingEditor/:id',
        loadChildren: () =>
          import(
            './home/product-center/Incoming-editor/Incoming-editor.module'
          ).then((m) => m.IncomingEditorModule),
      },
      {
        path: 'importDetail/:id',
        loadChildren: () =>
          import(
            './home/product-center/import-detail/import-detail.module'
          ).then((m) => m.ImportDetailModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
