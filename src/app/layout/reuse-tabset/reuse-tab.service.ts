import { uuid } from './../../shared/utils';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { ReuseTab } from './tab.model';
import { DYNAMIC_COMPONENTS } from '../../home/index';
import * as _ from 'lodash';

export type handleType = 'add' | 'refresh' | 'remove';

@Injectable({
  providedIn: 'root',
})
export class ReuseTabService {
  private _currentTab: ReuseTab | undefined;
  private _cachedReuseTabList: Array<ReuseTab> = [];
  private _tab$: Subject<{ type: handleType; tab: ReuseTab; index: number }> =
    new Subject();
  constructor() {}

  get change() {
    return this._tab$.asObservable();
  }

  get len() {
    return this._cachedReuseTabList.length;
  }

  get current() {
    return this._currentTab!;
  }

  set current(tab: ReuseTab) {
    this._currentTab = tab;
  }

  /**
   * 添加一个tab
   * 如果当前页面不存在，新增这个页面
   * 如果这个页面存在，那么需要进行刷新
   * @param reuseTab
   * @param forceRefresh 如果当前组件已经加载是否进行重新加载（刷新）
   */
  addTab(reuseTab: ReuseTab, forceRefresh?: boolean) {
    if (!reuseTab || !reuseTab.componentName) {
      throw new Error('必须要传入componentName');
    }
    const index = this.getIndex(reuseTab);
    if (index == -1) {
      if (!reuseTab.component) {
        const dynamicComponet = this.getComponentByName(reuseTab.componentName);
        reuseTab.component = dynamicComponet.component;
        reuseTab.title = dynamicComponet.title;
        reuseTab.closeable = dynamicComponet.closeable;
      }
      reuseTab.uuid = uuid();
      this._cachedReuseTabList.push(reuseTab);
      this._tab$.next({
        type: 'add',
        tab: reuseTab,
        index: this.getIndex(reuseTab),
      });
      this.current = reuseTab;
    } else {
      const newTab = _.assign(this._cachedReuseTabList[index], reuseTab);
      if (forceRefresh === true) {
        newTab.uuid = uuid();
      }
      this.refreshTab(newTab, index);
    }
  }

  /**
   * 刷新tab
   * @param reuseTab
   */
  private refreshTab(reuseTab: ReuseTab, index: number) {
    this._cachedReuseTabList.splice(index, 1, reuseTab);
    this._tab$.next({ type: 'refresh', tab: reuseTab, index });
    this._currentTab = reuseTab;
  }

  /**
   * 移除tab
   * @param reuseTab
   */
  removeTab(reuseTab: ReuseTab) {
    const index = this.getIndex(reuseTab);
    if (index > -1) {
      this._cachedReuseTabList.splice(index, 1);
      this._currentTab = this._cachedReuseTabList[this.len - 1];
      this._tab$.next({ type: 'remove', tab: reuseTab, index });
    }
  }

  /**
   * 移除其他的tab
   * @param reuseTab
   */
  removeOthers(reuseTab: ReuseTab) {}

  /**
   * 移除所有的tab
   */
  clear() {}

  private getIndex(reuseTab: ReuseTab) {
    if (!reuseTab) return -1;
    return this._cachedReuseTabList.findIndex(
      (ele) => ele.componentName == reuseTab.componentName
    );
  }

  private getComponentByName(componnetName: string) {
    const dynamicComponent = DYNAMIC_COMPONENTS.find(
      (ele) => ele.name === componnetName
    );
    if (!dynamicComponent) {
      throw new Error(
        '组件名称为' + componnetName + '未能找到对应的注册组件！'
      );
    }
    return dynamicComponent;
  }
}
