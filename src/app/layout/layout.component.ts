import { Component, OnInit } from '@angular/core';
import { ReuseTab } from './reuse-tabset/tab.model';
import { ReuseTabService } from './reuse-tabset/reuse-tab.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor(private reuseTabService: ReuseTabService) {}

  ngOnInit() {
    this.reuseTabService.addTab({ componentName: 'ProductComponent' });
  }

  addTab(componentName: string) {
    const reuseTab: ReuseTab = { componentName };
    this.reuseTabService.addTab(reuseTab);
  }
}
