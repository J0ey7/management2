import { Component, Input, OnInit } from '@angular/core';
import { Config, ConfigvalueList } from '../../prodcut.model';
import { ManualService } from '../../manual.service';

@Component({
  selector: 'app-manual-model-config',
  templateUrl: './manual-model-config.component.html',
  styleUrls: ['./manual-model-config.component.css'],
})
export class ManualModelConfigComponent implements OnInit {
  constructor(private manualService: ManualService) {}
  @Input() configList: Array<Config> = [];
  allChecked: boolean = false;

  ngOnInit() {}
  // 添加配置项
  addConfig() {
    const configValue: Config = {
      configvalueList: [],
      name: '',
      isMulti: false,
    };
    if (!this.configList) {
      this.configList = [];
    }
    this.configList.push(configValue);
  }

  // 产品配置参数
  addConfigValue(config: Config) {
    // 初始化
    if (!config.configvalueList) {
      config.configvalueList = [];
    }
    const configValue: ConfigvalueList = { value: '' };
    config.configvalueList.push(configValue);
  }

  // 删除操作按钮
  removeConfig(index: number) {
    this.configList.splice(index, 1);
  }
  // 删除配置项
  removeConfigValue(config: Config, index: number) {
    config.configvalueList?.splice(index, 1);
    console.log(config);
  }
}
