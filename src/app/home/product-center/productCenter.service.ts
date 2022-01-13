import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpService } from '../../shared/services/http.service';
import { ProductCenterSearch } from './product-center-search.model';
import { Product } from './product-center.model';
import { ProductCenterName } from './product-center.model';
import { Page } from '../../shared/models/page.model';
import { imporSearch } from './product-center-search.model';

@Injectable({ providedIn: 'root' })
export class ProductCenterService extends BaseService<
  Product,
  ProductCenterSearch
> {
  baseUrl = '/api/product';
  constructor(protected http: HttpService) {
    super(http);
  }
  getName(): Promise<ProductCenterName[]> {
    return this.http.get(`/api/manual/getName`);
  }

  getManulList(data: ProductCenterSearch): Promise<Page<Product>> {
    return this.http.post(`/api/manual/getList`, data);
    // getInfo(id: string): Promise<any> {
    //   return this.http.get(`/api/manual/getInfo/${id}`);
    // }
  }

  getManulListById(id: string): Promise<Product> {
    return this.http.get(`/api/manual/getInfo/${id}`);
  }

  // 商品入库接口
  imporSave(search: imporSearch) {
    return this.http.post('/api/product/save', search);
  }
}
