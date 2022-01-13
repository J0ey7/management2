import { HttpService } from './http.service';
import { Page } from '../models/page.model';
import { Result } from '../models/result.model';

export abstract class BaseService<M, S> {
  abstract baseUrl: string;
  constructor(protected http: HttpService) {}

  // 获取详细接口
  getInfo(id: string): Promise<M> {
    return this.http.get(`${this.baseUrl}/getInfo/${id}`);
  }

  // 获取列表数据，带分页
  getList(data: S): Promise<Page<M>> {
    return this.http.post(`${this.baseUrl}/getList`, data);
  }

  // 获取列表数据，没分页，获取所有列表数据
  getListWithoutPage(): Promise<Array<M>> {
    return this.http.post(`${this.baseUrl}/getList`, { ifPage: false });
  }

  // 保存接口
  save(data: M): Promise<Result<string>> {
    return this.http.post(`${this.baseUrl}/save`, data);
  }
  // 删除接口
  delete(id: string): Promise<M> {
    return this.http.get(`${this.baseUrl}/delete/${id}`);
  }
}
