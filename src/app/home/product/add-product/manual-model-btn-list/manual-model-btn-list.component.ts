import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-manual-model-btn-list',
  templateUrl: './manual-model-btn-list.component.html',
  styleUrls: ['./manual-model-btn-list.component.css'],
})
export class ManualModelBtnListComponent
  implements OnInit, OnChanges, OnDestroy
{
  // 具体参数值
  valueText: string = '';
  // 红色×是否出现
  isShowHover: boolean = false;

  @Input() editText: boolean = false; //编辑上是否显示字符串,
  @Input() onHandleEdit?: (data?: any) => any; // 点击按钮上的编辑
  @Input() btnValue?: string; //按钮上的输入值
  // 传值
  // btnValue的双向绑定必须存在btnValueChange！！！！！
  @Output() btnValueChange: EventEmitter<string> = new EventEmitter();
  // 移除按钮
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  private valueChangeSubject: Subject<string> = new Subject();
  private valueChangeSub$: Subscription;

  constructor() {
    this.valueChangeSub$ = this.valueChangeSubject
      .pipe(debounceTime(500))
      .subscribe((btnValue) => {
        this.btnValueChange.emit(btnValue);
      });
  }
  // ngOnChanges为@input输入参数变化时才调用,changes为@input声明的值
  ngOnChanges(changes: SimpleChanges) {
    const btnValue = changes['btnValue'];
    if (btnValue && btnValue.currentValue != btnValue.previousValue) {
      this.valueText = btnValue.currentValue;
    }
  }

  ngOnInit() {}
  //  组件销毁
  ngOnDestroy() {
    this.valueChangeSub$.unsubscribe();
  }

  onNgModelChange(value: string) {
    this.valueChangeSubject.next(value);
  }

  close() {
    this.onClose.emit(this.btnValue);
  }
  editBtn() {
    if (this.onHandleEdit) {
      this.onHandleEdit(this.btnValue);
    }
  }
}
