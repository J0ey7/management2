import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// 富文本编辑器
import { UEditorModule } from 'ngx-ueditor';

// 封装的三个组件
import { PaginationTplComponent } from './components/pagination-tpl/pagination-tpl.component';

// 库的组件
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  imports: [CommonModule, NzSelectModule, NzPaginationModule, FormsModule],
  declarations: [PaginationTplComponent],
  exports: [
    NzButtonModule,
    NzDividerModule,
    NzMenuModule,
    NzDescriptionsModule,
    NzCarouselModule,
    FormsModule,
    CommonModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzFormModule,
    NzSelectModule,
    NzUploadModule,
    NzTabsModule,
    NzIconModule,
    NzPaginationModule,
    NzTableModule,
    NzTreeModule,
    NzTagModule,
    NzSpinModule,
    NzCheckboxModule,
    NzModalModule,
    NzInputModule,
    NzRadioModule,
    NzDatePickerModule,
    PaginationTplComponent,
  ],
})
export class SharedModule {}
