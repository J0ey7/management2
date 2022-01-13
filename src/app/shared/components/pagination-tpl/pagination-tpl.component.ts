import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Page } from '../../models/page.model';

@Component({
  selector: 'app-pagination-tpl',
  templateUrl: './pagination-tpl.component.html',
  styleUrls: ['./pagination-tpl.component.css'],
})
export class PaginationTplComponent<T> implements OnInit {
  // 传入的页面数据
  @Input() page!: Page<T>;
  @Output() pageChanged: EventEmitter<{
    currentPage: number;
    pageRecord: number;
  }> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  pageIndexChanged($event: number) {
    this.pageChanged.emit({
      currentPage: $event,
      pageRecord: this.page.pageRecord,
    });
  }

  pageSizeChanged($event: string) {
    this.pageChanged.emit({
      currentPage: this.page.currentPage,
      pageRecord: parseInt($event),
    });
  }
}
