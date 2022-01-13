import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
// 导入指令获取锚点
import { TabContainerDirective } from './reuse-tabset/tab-container.directive';
import { ReuseTabsetComponent } from './reuse-tabset/reuse-tabset.component';
import { TabTplComponent } from './reuse-tabset/tab-tpl.component';
import { SharedModule } from '../shared/share.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    LayoutComponent,
    ReuseTabsetComponent,
    TabTplComponent,
    TabContainerDirective,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
