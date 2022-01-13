import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Company } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  // 请求地址
  private baseUrl = '/api/company/getList';
  constructor(private http: HttpService) {}

  getList(): Promise<Company[]> {
    return this.http.post(this.baseUrl, {});
  }
}
