import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReuseTabService, handleType } from './reuse-tab.service';
import { ReuseTab } from './tab.model';

@Component({
  selector: 'app-reuse-tabset',
  templateUrl: './reuse-tabset.component.html',
  styleUrls: ['./reuse-tabset.component.less'],
})
export class ReuseTabsetComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;
  tabList: ReuseTab[] = [];

  private reuseTabSub: Subscription;

  constructor(private reuseTabService: ReuseTabService) {
    this.reuseTabSub = this.reuseTabService.change.subscribe((data) => {
      console.log('data', data);

      this.genTabList(data);
    });
  }
  ngOnDestroy(): void {
    this.reuseTabSub.unsubscribe();
  }

  ngOnInit(): void {}
  trackByItems(index: number, item: ReuseTab): string {
    return item.uuid!;
  }
  onTabClose(tab: ReuseTab) {
    console.log('remove', tab);
    this.reuseTabService.removeTab(tab);
  }
  // 得到要加载组件的列表
  private genTabList(data: { index: number; type: handleType; tab: ReuseTab }) {
    const { type, tab, index } = data;
    this.currentIndex = index;
    switch (type) {
      case 'remove':
        if (this.isCloseable(tab)) {
          this.tabList.splice(index, 1);
          this.currentIndex = this.tabList.length - 1;
        }
        break;
      case 'add':
        this.tabList.push(tab);
        break;
      case 'refresh':
        this.tabList.splice(index, 1, tab);
        break;
    }
  }

  private isCloseable(tab: ReuseTab) {
    return tab.closeable != false && this.tabList.length > 1;
  }
}
