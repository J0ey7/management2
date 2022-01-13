import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestBody } from '../module';
// 设置延迟时间，让html渲染之后再得到数据
const FETCH_LATENCY = 500;
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private companyUrl = 'api/company/getList';
  private itemUrl = 'api/dictionarydetail/getAll';
  private productUrl = '/api/manual/getList';

  private prouctIdUrl = '/api/manual/getInfo';
  // 获取商品品牌
  getCompanys(): Observable<any> {
    return this.http.post<any>(this.companyUrl, {}).pipe(delay(FETCH_LATENCY));
  }
  // 获取所有商品
  getProduct(pageRequest: RequestBody): Observable<any> {
    return this.http.post<any>(this.productUrl, pageRequest);
  }
  // 产品分类
  getItems(): Observable<any> {
    return this.http.get<any>(this.itemUrl).pipe(delay(FETCH_LATENCY));
  }

  // 根据商品id获取商品
  getProductById(id: string): Observable<any> {
    const url = this.prouctIdUrl + '/' + id;
    return this.http.get<any>(url);
  }
}
