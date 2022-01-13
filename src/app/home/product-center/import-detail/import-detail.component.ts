import { Component, OnInit, Input } from '@angular/core';
import { ProductCenterService } from '../productCenter.service';
import { ActivatedRoute, Router } from '@angular/router';
// 动态组件需要的类型及服务
import { ReuseTab } from '../../../layout/reuse-tabset/tab.model';
import { ReuseTabService } from '../../../layout/reuse-tabset/reuse-tab.service';
import {
  Product,
  Model,
  Config,
  ConfigvalueList,
} from '../product-center.model';
import { UploadContent } from '../../../shared/models/upload-content.model';

@Component({
  selector: 'app-import-detail',
  templateUrl: './import-detail.component.html',
  styleUrls: ['./import-detail.component.css'],
})
export class ImportDetailComponent implements OnInit {
  // // 路由传过来的id
  // id!: string;

  // 动态组件传入的值
  @Input() data: { id: string } = { id: '' };

  // 页面绑定的值
  manual: Product = { modelList: [], configList: [] };
  // 图片
  imgList: Array<UploadContent> = [];
  // computedConValList
  computedConValList: Array<Config> = [];
  // 当前选中的产品型号
  selectedModel!: Model;
  // 序列号
  serialNumber!: string;
  // 商品日期
  productDate!: string;
  // 所有选中的参数id值
  valueIds!: string[];
  // 返回的商品型号id
  modelId!: string;
  // 特定的型号
  selectModel: Model[] = [];
  // 选中的公共配置
  selectConfigList: Config[] = [];
  // 选中的value值
  selectConfigListValue: ConfigvalueList[] = [];
  // 选中的私有value值
  selectPrivate: Config[] = [];
  asdasdas: any = [];
  constructor(
    private router: Router,
    private productCenterService: ProductCenterService,
    private route: ActivatedRoute,
    private reuseTabService: ReuseTabService
  ) {
    // this.id = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.getInfo(this.data.id);
  }

  getInfo(id: string) {
    this.productCenterService.getInfo(id).then((res) => {
      this.serialNumber = res.serialNumber!;
      this.productDate = res.productDate!;
      this.valueIds = res.valueIds!.split(';');
      this.modelId = res.modelId!;
      // 初始化商品
      this.productCenterService
        .getManulListById(res.manualId!)
        .then((res: Product) => {
          this.selectModel = res.modelList?.filter((item) => {
            return item.id === this.modelId;
          })!;
          console.log(this.selectModel);

          this.manual = res;
          console.log(this.manual);
          this.getNewconfigList();
          this.getNewPrivate();

          // this.computedConValList = this.computedConfigList(this.manual)!;
          this.imgList = res.contentList!;
        });
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
  // private computedConfigList(manual: Product) {
  //   let configArray: Array<Config> = [];
  //   const modelList = manual.modelList;
  //   if (!modelList || !modelList.length) return;
  //   modelList.forEach((ele) => {
  //     ele.configList?.forEach((con) => {
  //       const index = configArray.findIndex((e) => e.name === con.name);
  //       // 配置项没有重叠的name
  //       if (index == -1) {
  //         con.configvalueList!.forEach((ele) => {
  //           ele.hostIds = [ele.hostId!];
  //         });
  //         configArray.push(con);
  //       } else {
  //         // 配置项有重叠的name
  //         const config = configArray[index];
  //         let conValList = config.configvalueList;
  //         conValList = conValList!.concat(con.configvalueList!);
  //         const newConValList: Array<ConfigvalueList> = [];
  //         conValList.forEach((v) => {
  //           // 配置值有重叠的value
  //           const i = newConValList.findIndex((e) => e.value === v.value);
  //           if (i == -1) {
  //             if (!v.hostIds) v.hostIds = [v.hostId!];
  //             newConValList.push(v);
  //           } else {
  //             newConValList[i].hostIds?.push(v.hostId!);
  //           }
  //         });
  //         configArray[index].configvalueList = newConValList;
  //       }
  //     });
  //   });
  //   return configArray;
  // }
  // 通过路由跳转入库编辑
  // 入库编辑
  // editClick(): void {
  //   // console.log('编辑成功');
  //   this.router.navigate(['/incomingEditor', this.data.id]);
  // }

  // 共有的配置名
  getNewconfigList() {
    // 配置名称
    const configLsit: Config[] = this.manual.configList!;

    configLsit?.filter((ele: any) => {
      ele.configvalueList?.forEach((el: any) => {
        this.valueIds.forEach((item) => {
          if (el.id === item) {
            ele.configvalueList = [el];
            this.selectConfigList.push(ele);
            console.log(this.selectConfigList);
          }
        });
      })!;
    });
  }

  // 私有配置值
  private getNewPrivate() {
    const configLsit: Config[] = this.selectModel[0].configList!;
    configLsit?.forEach((ele: any) => {
      ele.configvalueList.forEach((el: any) => {
        this.valueIds.forEach((item) => {
          if (el.id === item) {
            ele.configvalueList = [el];
            this.selectPrivate.push(ele);
          }
        });
      });
    });
    console.log(this.selectPrivate);
    console.log(this.selectModel);
  }

  // 动态加载组件，添加页面
  addTab(componentName: string, id?: string) {
    const reuseTab: ReuseTab = { componentName, data: id ? { id } : undefined };
    this.reuseTabService.addTab(reuseTab, !!id);
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
}
