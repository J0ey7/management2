import { Component, OnInit } from '@angular/core';
import { ProductCenterService } from '../productCenter.service';
import { DictionaryService } from '../../../shared/services/dictionary.service';
import { Dictionary } from '../../../shared/models/dictionary.model';
import * as _ from 'lodash';
import {
  Product,
  Config,
  Model,
  ConfigvalueList,
  modelALl,
} from '../product-center.model';
import { UploadContent } from '../../../shared/models/upload-content.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductCenterSearch } from '../product-center-search.model';
import { Router } from '@angular/router';
import { ReuseTabService } from '../../../layout/reuse-tabset/reuse-tab.service';

@Component({
  selector: 'app-import-storage',
  templateUrl: './import-storage.component.html',
  styleUrls: ['./import-storage.component.css'],
})
export class ImportStorageComponent implements OnInit {
  constructor(
    private router: Router,
    private productCenterService: ProductCenterService,
    private dictionaryService: DictionaryService,
    private nzModalService: NzModalService,
    private reuseTabService: ReuseTabService
  ) {}
  // 页面绑定的值
  manual: Product = { modelList: [], configList: [] };
  manualList: Array<Product> = [];
  // computedConValList
  computedConValList: Array<Config> = [];
  // 当前选中的产品型号
  selectedModel!: Model;
  // 当前选中的产品值
  selectedConfigValue: ConfigvalueList[] = [];
  // 特定型号具有的产品值
  selectedModelConfigValue: ConfigvalueList[] = [];

  // 产品分类
  productTypeList: Array<Dictionary> = [];
  // 图片
  imgList: Array<UploadContent> = [];
  // 选中的按钮
  currentIndex: number = -1;
  // value数组
  valueIds: string[] = [];
  // 发请求后传出去的id值
  id!: string;
  //产品配置项是否显示
  isShowModel: boolean = false;

  ngOnInit() {
    this.getManualType();
  }

  // 获取所有产品分类
  private getManualType() {
    const mlzlPromise = this.dictionaryService.getDicListByCode('DM_MLZL');
    const cpzlPromise = this.dictionaryService.getDicListByCode('DM_CPZL');
    Promise.all([mlzlPromise, cpzlPromise]).then(([mlzlList, cpzlList]) => {
      this.productTypeList = mlzlList.map((ele) => {
        ele.children = cpzlList.filter((e) => e.pitemCode == ele.itemCode);
        return ele;
      });
    });
  }

  getName(event: string) {
    const search: ProductCenterSearch = {
      currentPage: 1,
      pageRecord: 15,
      productCode: event,
    };

    this.productCenterService.getManulList(search).then((el) => {
      this.manualList = el.result;
    });
  }

  getProduct(id: string) {
    if (!id) return;
    this.productCenterService.getManulListById(id).then((res) => {
      this.manual = res;
      console.log(res);
      this.computedConValList = this.computedConfigList(this.manual)!;
      console.log('ddd', this.computedConfigList);

      this.imgList = this.manual.contentList?.filter(
        (ele) => ele.contentType == 0
      )!;
      if (this.manual.modelList!.length) {
        // 默认选中当前第一个型号
        this.selectedModel = this.manual.modelList![0];
      }
    });
    this.isShowModel = true;
  }
  /**
   * 计算每个型号独有的配置项
   * 核心逻辑：1. 每个configValue 对象都有一个hostId 属性，如果 hostId 和model 的id 相等，代表此configValue 属于model
   *          2. 一个configValue 可以属于多个model ，也就是说mode的私有配置项有重叠的部分
   *          3. 找出重叠的configValue，并构造一个 hostIds 字符串数组，记录配置重叠的model id
   *          4. 配置项重叠通过 config 的name 判断，配置value 重叠通过 confgValue对象的value 判断
   *
   */
  private computedConfigList(manual: Product) {
    let configArray: Array<Config> = [];
    const modelList = manual.modelList;
    if (!modelList || !modelList.length) return;
    modelList.forEach((ele) => {
      ele.configList?.forEach((con) => {
        const index = configArray.findIndex((e) => e.name === con.name);
        // 配置项没有重叠的name
        if (index == -1) {
          con.configvalueList!.forEach((ele) => {
            ele.hostIds = [ele.hostId!];
          });
          configArray.push(con);
        } else {
          // 配置项有重叠的name
          const config = configArray[index];
          let conValList = config.configvalueList;
          conValList = conValList!.concat(con.configvalueList!);
          const newConValList: Array<ConfigvalueList> = [];
          conValList.forEach((v) => {
            // 配置值有重叠的value
            const i = newConValList.findIndex((e) => e.value === v.value);
            if (i == -1) {
              if (!v.hostIds) v.hostIds = [v.hostId!];
              newConValList.push(v);
            } else {
              newConValList[i].hostIds?.push(v.hostId!);
            }
          });
          configArray[index].configvalueList = newConValList;
        }
      });
    });
    return configArray;
  }

  isModelSelected(model: Model) {
    return this.selectedModel && this.selectedModel.id === model.id;
  }

  isConValSelected(conVal: ConfigvalueList) {
    return (
      this.selectedModel &&
      conVal.hostIds?.findIndex((ele) => ele === this.selectedModel.id)! > -1
    );
  }

  save() {
    this.nzModalService.confirm({
      nzTitle: '提示',
      nzContent: '确认保存吗？',
      nzOnOk: () => {
        // 把请求体添加完成
        const arr1: string[] = this.selectedConfigValue.map((item) => {
          return item.id!;
        });
        const arr2: string[] = this.selectedModelConfigValue.map((item) => {
          return item.id!;
        });

        this.valueIds = arr1.concat(arr2);
        this.productCenterService
          .imporSave({
            manualId: this.manual.id,
            modelId: this.selectedModel.id,
            productDate: this.manual.productDate!,
            serialNumber: this.manual.serialNumber!,
            valueIds: this.valueIds.join(';'),
          })
          .then((res: any) => {
            console.log(res);

            this.id = res;

            this.nzModalService.success({
              nzTitle: '提示',
              nzContent: '保存成功',
              nzOnOk: () => {
                // this.router.navigate(['/importDetail', this.id]);
                this.reuseTabService.removeTab({
                  componentName: 'ImportStorageComponent',
                });
                this.reuseTabService.addTab(
                  {
                    componentName: 'ProductCenterComponent',
                  },
                  true
                );
              },
            });
          });
      },
    });
  }
  cancel() {
    this.router.navigate(['/productCenter']);
    this.reuseTabService.removeTab({
      componentName: 'ImportStorageComponent',
    });
    this.reuseTabService.addTab({ componentName: 'ProductCenterComponent' });
  }
  // 产品型号
  modelClick(model: Model) {
    this.selectedModel = model;
  }

  // 公共类型
  btnClick(valueId: modelALl, index1?: number, index2?: number) {
    if (this.manual.configList) {
      this.manual.configList[index1!].configvalueList?.map(
        (item) => (item.dynamic = false)
      );
      this.manual.configList[index1!].configvalueList![index2!].dynamic = true;
    }

    this.selectedConfigValue[index1!] = valueId;
  }

  btnClick2(valueId: modelALl, index1?: number, index2?: number) {
    if (this.selectedModel.configList) {
      this.computedConValList[index1!].configvalueList?.map(
        (item) => (item.dynamic = false)
      );
      this.computedConValList[index1!].configvalueList![index2!].dynamic = true;
    }
    this.selectedModelConfigValue[index1!] = valueId;
  }
}
