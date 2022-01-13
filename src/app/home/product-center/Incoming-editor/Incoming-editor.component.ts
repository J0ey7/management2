import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductCenterService } from '../productCenter.service';
import * as _ from 'lodash';
import { UploadContent } from '../../../shared/models/upload-content.model';
import { Dictionary } from '../../../shared/models/dictionary.model';
import { Product, modelALl } from '../product-center.model';
import { ProductCenterSearch } from '../product-center-search.model';
import { Config, ConfigvalueList, Model } from '../product-center.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReuseTabService } from '../../../layout/reuse-tabset/reuse-tab.service';

import { DictionaryService } from '../../../shared/services/dictionary.service';

@Component({
  selector: 'app-Incoming-editor',
  templateUrl: './Incoming-editor.component.html',
  styleUrls: ['./Incoming-editor.component.css'],
})
export class IncomingEditorComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productCenterService: ProductCenterService,
    private dictionaryService: DictionaryService,
    private nzModalService: NzModalService,
    private reuseTabService: ReuseTabService
  ) {
    // this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.getInfo(this.data.id);
    this.getManualType();
    this.getManualList();
  }

  // 路由传过来的id
  // id!: string;
  @Input() data: { id: string } = { id: '' };

  // 页面绑定的值
  manual: Product = { modelList: [], configList: [] };
  // product
  product: Product = {};
  // 图片
  imgList: Array<UploadContent> = [];
  // 产品分类
  productTypeList: Array<Dictionary> = [];
  // 产品列表
  manualList: Array<Product> = [];
  // computedConValList
  computedConValList: Array<Config> = [];
  // 当前选中的产品型号
  selectedModel!: Model;
  // 请求体中valueIds
  valueIds: string[] = [];
  // 当前选中的产品值
  selectedConfigValue: ConfigvalueList[] = [];
  // 特定型号具有的产品值
  selectedModelConfigValue: ConfigvalueList[] = [];
  //共有属性的索引值
  currentIndex: number = 0;

  getInfo(id: string) {
    this.productCenterService.getInfo(id).then((res) => {
      this.product = res;
      this.valueIds = res.valueIds?.split(';')!;

      // 初始化商品图片
      this.productCenterService
        .getManulListById(res.manualId!)
        .then((res: Product) => {
          this.manual = res;
          console.log(res);
          this.imgList = res.contentList!;
          this.computedConValList = this.computedConfigList(this.manual)!;
          // this.getSelect(this.manual.configList!);
          this.manual.modelList?.forEach((item) => {
            if (item.id === this.product.modelId) {
              this.selectedModel = item;
            }
          });
          // 用一个数记住私有属性从第几开始增加
          this.currentIndex = res.configList?.length!;

          this.getSelect(this.manual.configList!, true);
          this.getSelect(this.manual.modelList!, true);
        });
    });
  }
  // 让选中的样式改变
  getSelect(item: modelALl[], isChoice: boolean) {
    item.forEach((ele: any) => {
      // if (ele.confingList != null) {
      // } else {
      //   // ele.configvalueList.forEach((el: any) => {
      //   //   this.valueIds.forEach((i) => {
      //   //     if (el.id === i) {
      //   //       el.dynamic = true;
      //   //     }
      //   //   });
      //   // });
      //   console.log(123);
      // }

      if (ele.configList) {
        ele.configList.forEach((el: any) => {
          el.configvalueList.forEach((ell: any) => {
            this.valueIds.forEach((i) => {
              if (ell.id === i) {
                ell.dynamic = isChoice;
              }
            });
          });
        });
      } else {
        ele.configvalueList.forEach((el: any) => {
          this.valueIds.forEach((i) => {
            if (el.id === i) {
              el.dynamic = isChoice;
            }
          });
        });
      }
    });
  }
  modelClick(model: Model) {
    this.selectedModel = model;
    this.product.modelId = model.id;
    this.product.valueIds = '';
    // this.manual.configList?.forEach((item) => {
    //   item.configvalueList?.forEach((el) => {
    //     el.dynamic = false;
    //   });
    // });
    // this.manual.configList?.forEach((item) => {
    //   item.configvalueList?.forEach((el) => {
    //     el.dynamic = false;
    //   });
    // });
    this.getSelect(this.manual.configList!, false);
    this.getSelect(this.manual.modelList!, false);
  }

  // 选择产品名称发送请求
  getProduct(id: string) {
    if (!id) return;
    this.productCenterService.getManulListById(id).then((res) => {
      this.manual = res;
      console.log(res);

      console.log('ddd', this.computedConfigList);

      this.imgList = this.manual.contentList?.filter(
        (ele) => ele.contentType == 0
      )!;
      if (this.manual.modelList!.length) {
        // 默认选中当前第一个型号
        this.selectedModel = this.manual.modelList![0];
      }
    });
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
  // 获取所有商品名称
  getManualList(): void {
    const search = {
      currentPage: 1,
      pageRecord: 15,
    };
    this.productCenterService.getManulList(search).then((res) => {
      this.manualList = res.result;
    });
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
  // 共有配置值单选
  btnClick(valueId: modelALl, index1?: number, index2?: number) {
    if (this.manual.configList) {
      this.manual.configList[index1!].configvalueList?.map(
        (item) => (item.dynamic = false)
      );
      this.manual.configList[index1!].configvalueList![index2!].dynamic = true;
    }

    const arr: string[] = this.product.valueIds?.split(';')!;
    arr[index1!] = valueId.id!;
    this.product.valueIds = arr.join(';');
  }
  // 私有配置值多选
  btnClick2(valueId: modelALl, index1?: number, index2?: number) {
    if (this.selectedModel.configList) {
      this.computedConValList[index1!].configvalueList?.map(
        (item) => (item.dynamic = false)
      );
      this.computedConValList[index1!].configvalueList![index2!].dynamic = true;
    }

    const arr: string[] = this.product.valueIds?.split(';')!;
    arr[index1! + this.currentIndex] = valueId.id!;
    this.product.valueIds = arr.join(';');
    console.log(this.product.valueIds);
  }

  // 保存操作
  save() {
    this.nzModalService.confirm({
      nzTitle: '提示',
      nzContent: '确认保存吗？',
      nzOnOk: () => {
        this.productCenterService
          .imporSave(
            this.product
            //   {
            //   manualId: this.manual.id,
            //   modelId: this.product.id,
            //   productDate: this.product.productDate!,
            //   serialNumber: this.product.serialNumber!,
            //   valueIds: this.valueIds.join(';'),
            // }
          )
          .then((res: any) => {
            console.log(res);

            this.data.id = res;

            this.nzModalService.success({
              nzTitle: '提示',
              nzContent: '保存成功',
              nzOnOk: () => {
                // this.router.navigate(['/productCenter']);
                this.reuseTabService.addTab(
                  {
                    componentName: 'ImportDetailComponent',
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
    // this.router.navigate(['/productCenter']);
    this.reuseTabService.removeTab({
      componentName: 'IncomingEditorComponent',
    });
  }
  // 删除按钮
  delete() {
    this.nzModalService.confirm({
      nzTitle: '提示',
      nzContent: '确认删除吗？',
      nzOnOk: () => {
        this.productCenterService.delete(this.product.id!).then((res: any) => {
          this.data.id = res;

          this.nzModalService.success({
            nzTitle: '提示',
            nzContent: '删除成功',
            nzOnOk: () => {
              this.cancel();
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
}
