import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Model, Config, ConfigvalueList } from '../../prodcut.model';

@Component({
  selector: 'app-manual-model-modal',
  templateUrl: './manual-model-modal.component.html',
  styleUrls: ['./manual-model-modal.component.css'],
})
export class ManualModelModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  // 传入商品型号
  @Input() model: Model = { modelName: '', configList: [] };
  // 控制是取消操作还是删除操作
  @Input() isEdit: boolean = false;
  // 保存商品型号
  @Output() onSave: EventEmitter<Model> = new EventEmitter();
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();
  private _isVisible: boolean = false;
  constructor(private modalService: NzModalService) {}
  set visible(isVisible: boolean) {
    this._isVisible = isVisible;
  }
  get visible() {
    return this._isVisible;
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    const isVisible = changes['isVisible'];
    if (isVisible && isVisible.currentValue != isVisible.previousValue) {
      this.visible = isVisible.currentValue;
    }
  }
  // 取消
  closeModal() {
    this.visible = false;
    this.isVisibleChange.emit(this.visible);
  }
  // 让isVisible正常显示
  handleCancel(): void {
    this.isVisible = false;
    console.log(this.visible);
    this.isVisibleChange.emit(this.visible);
  }
  // 添加配置项
  addConfig() {
    const configValue: Config = {
      configvalueList: [],
      name: '',
      isMulti: false,
    };
    if (!this.model.configList) this.model.configList = [];
    this.model.configList.push(configValue);
  }
  // 添加配置项的值
  addConfigValue(config: Config) {
    if (!config.configvalueList) config.configvalueList = [];
    const configValue: ConfigvalueList = { value: '' };
    config.configvalueList.push(configValue);
  }
  // 移除配置项
  removeConfig(index: number) {
    this.model.configList?.splice(index, 1);
  }
  // 移除配置项的值
  removeConfigValue(config: Config, index: number) {
    config.configvalueList?.splice(index, 1);
  }

  // 删除
  del() {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确认删除吗',
      nzOnOk: () => {
        this.closeModal();
        this.onSave.emit(undefined);
      },
    });
  }
  // 保存
  save() {
    this.onSave.emit(this.model);
  }
}
