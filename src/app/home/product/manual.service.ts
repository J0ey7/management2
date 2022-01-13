import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpService } from '../../shared/services/http.service';
import { ManualSearch } from './manul-search.model';
import { Product } from './prodcut.model';
@Injectable({ providedIn: 'root' })
export class ManualService extends BaseService<Product, ManualSearch> {
  baseUrl = '/api/manual';

  constructor(protected http: HttpService) {
    super(http);
  }
}
