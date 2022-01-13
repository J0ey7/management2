import { ReuseTab } from './tab.model';
import { AfterViewInit, Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { TabContainerDirective } from './tab-container.directive';

@Component({
  selector: 'app-tab-tpl',
  template: `<ng-template tab-host></ng-template>`,
  host: {
    "style": "background:#f1f4f5;display:block;min-height:100%;width:100%;padding:0 10px;box-sizing:border-box;",
  }
})
export class TabTplComponent implements OnInit, AfterViewInit {
  @Input() tab!: ReuseTab;
  @ViewChild(TabContainerDirective) tabHost!: TabContainerDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadComponent()
    });
  }

  ngOnInit(): void {

  }


  /**
  * 加载组件
  */
  loadComponent() {
    if (this.tab.component) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tab.component!);
      let viewContainerRef = this.tabHost.viewContainerRef;
      let componentRef = viewContainerRef.createComponent(componentFactory);
      const data = this.tab.data || {};
      componentRef.instance.data = data;
    }
  }
}
