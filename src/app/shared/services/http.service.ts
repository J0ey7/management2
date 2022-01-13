import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private ERROR_INFO = '系统异常，请稍后重试';
  constructor(protected http: HttpClient) {}

  get<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http.get<Result<T>>(url).subscribe(
        (res: Result<T>) => {
          if (res.rlt === 0) {
            resolve(res.datas);
          } else {
            reject(res.info || this.ERROR_INFO);
          }
        },
        (err) => {
          // 敏感报错信息，在开发模式下打印即可
          if (!environment.production) {
            console.error(err);
          }
          reject(this.ERROR_INFO);
        }
      );
    });
  }
  post<T, S>(url: string, data: S): Promise<T> {
    return new Promise((resolve, reject) => {
      this.http.post<Result<T>>(url, data).subscribe(
        (res: Result<T>) => {
          if (res.rlt === 0) {
            resolve(res.datas);
          } else {
            reject(res.info || this.ERROR_INFO);
          }
        },
        (err) => {
          // 敏感报错信息，在开发模式下打印即可
          if (!environment.production) {
            console.error(err);
          }
          reject(this.ERROR_INFO);
        }
      );
    });
  }
}
