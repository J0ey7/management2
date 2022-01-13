import { Dictionary } from '../models/dictionary.model';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  // 缓存数据字典
  private _cachedDicList: Array<Dictionary> = []
  // 请求地址
  private baseUrl = '/api/dictionarydetail/getAll'

  constructor(private http: HttpService) { }

  /**
   *
   * 获取所有的字典数据
   * @return {*}  {Promise<Dictionary[]>}
   * @memberof DictionaryService
   */
  getAll(): Promise<Dictionary[]> {
    return this.http.get(this.baseUrl)
  }

  /**
   *
   * 根据字典code 获取字典数据
   * @param {string} dictCode
   * @return {*}  {Promise<Dictionary[]>}
   * @memberof DictionaryService
   */
  getDicListByCode(dictCode: string): Promise<Dictionary[]> {
    if (this._cachedDicList.length) {
      return Promise.resolve(this._cachedDicList.filter(ele => ele.dictCode === dictCode))
    } else {
      return this.getAll().then(res => {
        this._cachedDicList = res
        return res.filter(ele => ele.dictCode === dictCode)
      })
    }
  }
}
