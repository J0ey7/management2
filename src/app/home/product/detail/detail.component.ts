import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ParamsList, model } from '../../module';
import { Model, Product, Config, ConfigvalueList } from '../prodcut.model';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { UploadContent } from '../../../shared/models/upload-content.model';
import { ManualService } from '../manual.service';

// 动态组件类型
import { ReuseTab } from '../../../layout/reuse-tabset/tab.model';
import { ReuseTabService } from '../../../layout/reuse-tabset/reuse-tab.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  @ViewChild('tab') tab: any;
  product!: Product;
  productId!: string;
  productName!: string;
  productCode!: string;
  productImg: string[] = [];
  introduction!: string;
  companyName!: string;
  text!: any;
  // 型号
  modelList!: model[];
  obj: Array<any> = [];
  // 型号参数
  lastParams: Array<any> = [];

  res!: Array<ParamsList>;
  // 图片显示
  contentList!: Array<UploadContent>;
  // 路由传过来的id值
  // id: string;

  // 动态组件传入的值
  @Input() data: { id: string } = { id: '' };

  // 页面绑定的值
  manual: Product = { modelList: [], configList: [] };
  // 当前选中的产品型号
  selectedModel!: Model;
  // 图片
  imgList: Array<UploadContent> = [];
  // computedConValList
  computedConValList: Array<Config> = [];

  // 当前预览的图片
  selectedImgIndex: number = 0;
  // 当前活动的图片下标范围（最大，最小），超出下标隐藏
  private minImgIndex: number = 0;
  private maxImgIndex: number = 3;

  // 当前选中的产品型号图片
  get selecteImg(): UploadContent {
    return this.imgList[this.selectedImgIndex];
  }

  baseUrl: string = 'http://localhost:8081/';

  effect = 'scrollx';
  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private manualService: ManualService,
    private reuseTabService: ReuseTabService
  ) {
    // 通过路由传值
    // this.id = this.route.snapshot.paramMap.get('id')!;
  }

  // editClick(): void {
  //   // console.log('编辑成功');
  //   this.router.navigate(['/editProduct'], {
  //     queryParams: { id: this.product.id },
  //   });
  // }
  ngOnInit() {
    this.getProduct();
    // 最终版
    this.getInfo(this.data.id);
  }

  // 获取产品
  getProduct(): void {
    // const id = this.route.snapshot.paramMap.get('id')!;
    const id = this.data.id;
    this.productService.getProductById(id).subscribe((product) => {
      const data = product.datas;
      this.product = data;
      this.productName = data.productName;
      this.productCode = data.productCode;
      this.introduction = data.introduction;
      this.companyName = data.companyName;
      this.productId = data.id;
      this.contentList = data.contentList;
      this.contentList.forEach((item) => {
        const img = item.filePath + '/' + item.storeName;
        this.productImg.push(img);
      });
      console.log(this.productImg);

      // 型号参数
      // this.modelList.forEach((item) => {
      //   // let data: ParamsList = {
      //   //   name: '',
      //   //   value: [],
      //   // };
      //   let data: any = [];
      //   item.configList?.forEach((j) => {
      //     let values: Array<any> = [];
      //     j.configvalueList?.forEach((ele) => {
      //       // values.push(ele.value);
      //       values.push(ele);
      //     });
      //     data.push({ name: j.name, values: values });
      //   });
      //   this.obj.push(data);
      //   // console.log(item.id);
      // });

      // 整合所有参数
      // for (let i of this.obj) {
      //   for (let j of i) {
      //     let temp = this.lastParams.find((e) => e.name === j.name);
      //     if (temp == null) {
      //       this.lastParams.push(j);
      //     } else {
      //       temp.values = [...temp.values, ...j.values];
      //     }
      //   }
      // }
      // 去重
      // for (let i = 0; i < this.lastParams.length; i++) {
      //   const newArr = this.lastParams[i].values.reduce(
      //     (prev: any, curr: any) =>
      //       prev.includes(curr) ? prev : [...prev, curr],
      //     []
      //   );
      //   this.lastParams[i].values = newArr;
      // }
      // console.log(this.modelList);

      // console.log(this.lastParams);
      // console.log(this.contentList);

      // data.modelList.forEach((item: any) => {
      //   if (this.configList != undefined) {
      //     this.configList.push(item.configList);
      //   }
      // });
      // console.log(this.configList);
    });
  }

  // 获取产品型号信息
  getInfo(id: string) {
    if (!id) return;
    this.manualService.getInfo(id).then((res) => {
      this.manual = res;

      this.computedConValList = this.computedConfigList(this.manual)!;
      console.log('ddd', this.computedConfigList);

      this.imgList = this.manual.contentList?.filter(
        (ele) => ele.contentType == 0
      )!;
      console.log(this.imgList);

      // 补位，避免空出
      if (this.imgList.length < 4) {
        let len = 4 - this.imgList.length;
        for (let i = 0; i < len; i++) {
          this.imgList.push({});
        }
      }
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

  isModelSelected(model: Model) {
    return this.selectedModel && this.selectedModel.id === model.id;
  }

  isConValSelected(conVal: ConfigvalueList) {
    return (
      this.selectedModel &&
      conVal.hostIds?.findIndex((ele) => ele === this.selectedModel.id)! > -1
    );
  }

  // 动态加载组件，添加页面
  addTab(componentName: string, id?: string) {
    const reuseTab: ReuseTab = { componentName, data: id ? { id } : undefined };
    this.reuseTabService.addTab(reuseTab, !!id);
  }

  // 点击切换图片
  preImg() {
    if (this.selectedImgIndex > 0) {
      this.selectedImgIndex--;
      if (this.selectedImgIndex < this.minImgIndex) {
        this.minImgIndex--;
        this.maxImgIndex--;
      }
    } else {
      console.log('第一张');
    }
  }
  nextImg() {
    if (this.selectedImgIndex < this.imgList.length - 1) {
      if (!this.imgList[this.selectedImgIndex + 1].id) {
        console.log('已经是最后一张了');

        return;
      }
      this.selectedImgIndex++;
      if (this.selectedImgIndex > this.maxImgIndex) {
        this.minImgIndex++;
        this.maxImgIndex++;
      }
    } else {
      console.log('最后一张');
    }
  }

  // 确保不是无效下标值
  isNotActive(index: number) {
    return index < this.minImgIndex || index > this.maxImgIndex;
  }
}
