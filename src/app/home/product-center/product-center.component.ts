import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { Dictionary } from '../../shared/models/dictionary.model';
import { Company } from '../../shared/models/company.model';
import { Name } from '../../shared/models/name.model';
import {
  Product,
  ProductCenterName,
  ProductData,
} from './product-center.model';
import { DictionaryService } from '../../shared/services/dictionary.service';
import { CompanyService } from '../../shared/services/company.service';
import { ProductCenterService } from './productCenter.service';
import { SearchTag } from '../../shared/models/search-tag.model';
import { ProductCenterSearch } from './product-center-search.model';
// 组件类型
import { ReuseTabService } from '../../layout/reuse-tabset/reuse-tab.service';
import { ReuseTab } from '../../layout/reuse-tabset/tab.model';
import { Page } from '../../shared/models/page.model';

@Component({
  selector: 'app-product-center',
  templateUrl: './product-center.component.html',
  styleUrls: ['./product-center.component.css'],
})
export class ProductCenterComponent implements OnInit {
  constructor(
    private router: Router,
    private dictionaryService: DictionaryService,
    private productCenterService: ProductCenterService,
    private companyService: CompanyService,
    private reuseTabService: ReuseTabService
  ) {
    this.currentTime.startTime = this.dateFormater('YYYY-MM-DD');
    this.currentTime.day = Number(this.dateFormater('DD'));
    this.currentTime.month = Number(this.dateFormater('MM'));
    this.currentTime.year = Number(this.dateFormater('YYYY'));

    this.endTime.year = Number(this.dateFormater('YYYY'));
    this.endTime.day = Number(this.dateFormater('DD'));
    this.endTime.month = Number(this.dateFormater('MM'));
  }
  // 所有商品分类
  productTypeList: Array<Dictionary> = [];
  // 初始化商品
  manual: Product = { manualName: '' };
  // 商品列表
  manualList: Product[] = [];
  // 产品名称
  names: Array<ProductCenterName> = [];
  // 产品公司
  companyList!: Company[];
  // 开始时间
  currentTime: ProductData = {};
  // 结束时间
  endTime: ProductData = {};
  // 日期选择框是否出现
  isshowDate: boolean = true;
  // 日期选择框上的日期
  timeSelect: (Date | null)[] = [];
  // 搜索的开始时间
  startSearchTime!: string;
  endSearchTime!: string;
  // 商品图片
  productImg!: string;
  // 不显示分页器
  isShowPagination!: false;
  //page
  Page!: Page<Product>;
  // 标签
  tags: Array<SearchTag> = [];
  // 隐藏的标签
  _tags: Array<SearchTag> = [];
  // 请求体
  searchManual: ProductCenterSearch = new ProductCenterSearch();
  nzSpinning: boolean = false;

  ngOnInit(): void {
    this.getList(this.searchManual);
    this.getCompanys();
    this.getManualType();
    this.getNames();
    // this.getManualList();
    // this.doSearch();
  }
  // 获取contentList

  // 入库路由
  // importStorage(): void {
  //   this.router.navigate(['/importStorage']);
  // }

  /* 
    获取页面列表的数据
  */
  getList(search: ProductCenterSearch) {
    this.nzSpinning = true;
    this.productCenterService.getList(search).then((res) => {
      this.manualList = res.result;
      this.Page = res;
      console.log(res);
    });
  }
  // 输入框输入的隐藏标签
  onInputChange($event: KeyboardEvent) {
    const target: any = $event.target;
    const tag: SearchTag = {
      property: 'serialNumber',
      title: '产品序列号',
      text: target.value,
      value: target.value,
      hide: true,
    };
    const index = this._tags.findIndex((ele) => ele.property === tag.property);
    if (index == -1) {
      this._tags.push(tag);
    } else {
      this._tags.splice(index, 1, tag);
    }
  }
  // 移除tag 搜索标签
  removeTag(tag: SearchTag) {
    const index = this.getTagIndex(tag.property);
    this.tags.splice(index, 1);
    this._removeTag(tag);
    this.searchManual[tag.property] = undefined;
    if (tag.extraProperty) {
      this.searchManual[tag.extraProperty] = undefined;
    }
    this.doSearch();
  }

  // 移除隐藏的搜索标签
  private _removeTag(tag: SearchTag) {
    const index = this._tags.findIndex((ele) => ele.property === ele.property);
    if (index > -1) {
      this._tags.splice(index, 1);
    }
  }

  // 当前搜索条件
  private getTagIndex(property: string): number {
    return this.tags.findIndex((ele) => ele.property === property);
  }
  // 封装根据标签搜索条件请求的请求函数
  private doSearch(tag?: SearchTag, search?: ProductCenterSearch) {
    if (!search) search = new ProductCenterSearch();
    if (tag) {
      this.tags.forEach((ele) => {
        ele.hide = ele.property !== tag.property;
      });
      search[tag.property] = tag.value;
      search[tag.otherProperty!] = tag.otherValue;
    } else {
      // 找到搜索条件未隐藏的选项
      this.tags.forEach((ele) => {
        if (!ele.hide) {
          search![ele.property] = ele.value;
        }
      });
    }
    this.getList(search);
  }

  // 添加标签
  addtag(tag: SearchTag) {
    const index = this.getTagIndex(tag.property);
    if (index === -1) {
      if (tag.value) {
        this.tags.push(tag);
      }
    } else {
      this.tags.splice(index, 1, tag);
    }
    this.doSearch(tag);
  }
  // 搜索产品序列号
  search(): void {
    const tag: SearchTag = {
      property: 'serialNumber',
      extraProperty: 'serialNumber',
      title: '产品序列号',
      text: this.manual.serialNumber,
      value: this.manual.serialNumber,
    };

    this.addtag(tag);
    // this.productCenterService.getList().then(() => {});
    // this.productCenterService
    //   .getList({
    //     currentPage: 1,
    //     serialNumber: this.searchvalue,
    //     pageRecord: 10,
    //   })
    //   .then((res) => {
    //     this.manualList = res.result;
    //   });
  }
  // 获取所有商品名称
  private getNames(): void {
    this.productCenterService.getName().then((res) => {
      this.names = res;
    });
  }
  getListByName(event: Name, property: string) {
    const tag = {
      property,
      extraProperty: 'name',
      title: '产品名称',
      text: event.name,
      value: event.name,
    };
    this.addtag(tag);
  }

  // 获取所有商品分类
  private getManualType(): void {
    const mlzlPromise = this.dictionaryService.getDicListByCode('DM_MLZL');
    const cpzlPromise = this.dictionaryService.getDicListByCode('DM_CPZL');
    Promise.all([mlzlPromise, cpzlPromise]).then(([mlzlList, cpzlList]) => {
      this.productTypeList = mlzlList.map((ele) => {
        ele.children = cpzlList.filter((e) => e.pitemCode == ele.itemCode);
        return ele;
      });
    });
  }
  // 根据产品分类获取数据
  getListByType(event: Dictionary, property: string) {
    const tag = {
      property,
      extraProperty: 'type',
      title: '产品分类',
      text: event.itemName,
      value: event.itemCode,
    };
    // this.addtag(tag);
    this.addtag(tag);
  }
  // 获取所有的商品品牌
  private getCompanys(): void {
    this.companyService.getList().then((res) => {
      this.companyList = res;
    });
  }
  getListByCompanys(event: Company, property: string) {
    const tag: SearchTag = {
      property,
      extraProperty: 'company',
      title: '产品品牌',
      text: event.companyName,
      value: event.id,
    };
    this.addtag(tag);
    // mine
    // this.productCenterService
    //   .getList({
    //     currentPage: 1,
    //     pageRecord: 10,
    //     companyId: this.manual.companyId,
    //   })
    //   .then((res) => {
    //     this.manualList = res.result;
    //   });
  }

  // 初始化一开始存在的商品数据
  // getManualList(): void {
  //   this.productCenterService
  //     .getList({
  //       currentPage: 1,
  //       pageRecord: 15,
  //     })
  //     .then((res) => {
  //       this.manualList = res.result;
  //       console.log(res);
  //     });
  // }

  // 结合所有请求体进行查询
  searchAll(): void {
    const tags = this.tags.concat(this._tags);
    console.log(tags);

    const search: ProductCenterSearch = new ProductCenterSearch();
    this.tags = [];
    tags.forEach((ele) => {
      ele.hide = false;
      search[ele.property] = ele.value;
      const index = this.getTagIndex(ele.property);
      if (index == -1) {
        this.tags.push(ele);
      } else {
        const tag = this.tags[index];
        tag.value = ele.value;
        tag.text = ele.text;
      }
    });
    this.getList(search);
  }
  // 清除所有标签
  clearSearch(): void {
    this.searchManual = new ProductCenterSearch();
    this.tags = [];
    this._tags = [];
    this.manual = {};
    this.getList(this.searchManual);
  }
  // 日期选择框上的回调
  getTimeSelect(event: (Date | null)[]): void {
    this.timeSelect = event!;
    let startTime = this.dateFormater('YYYY-MM-DD', this.timeSelect[0]);
    let endTime = null;
    this.timeSelect.length < 2
      ? (endTime = startTime)
      : (endTime = this.dateFormater('YYYY-MM-DD', this.timeSelect[1]));
    const tag: SearchTag = {
      property: 'startTime',
      otherProperty: 'endTime',
      extraProperty: 'date',
      title: '产品日期',
      text: startTime + '至' + endTime,
      value: startTime,
      otherValue: endTime,
    };
    this.addtag(tag);
    // this.getProductByData(startTime, endTime);
    this.startSearchTime = startTime;
    this.endSearchTime = endTime;
  }

  // 点击按照日期发送请求
  getDay() {
    const endTime =
      this.endTime.year +
      '-' +
      this.endTime.month +
      '-' +
      (this.endTime.day! + 1);
    const startTime =
      this.currentTime.year +
      '-' +
      this.currentTime.month +
      '-' +
      this.currentTime.day;

    const tag: SearchTag = {
      property: 'startTime',
      otherProperty: 'endTime',
      extraProperty: 'date',
      title: '产品日期',
      text: '本日',
      value: startTime,
      otherValue: endTime,
    };
    this.addtag(tag);

    this.isshowDate = true;
    this.startSearchTime = startTime;
    this.endSearchTime = endTime;
  }
  getWeek() {
    const endTime =
      (this.endTime.month == 12 ? this.endTime.year! + 1 : this.endTime.year) +
      '-' +
      ((this.endTime.day! + 7 > 31
        ? this.endTime.month! + 1
        : this.endTime.month)! > 12
        ? '01'
        : this.endTime.month!) +
      '-' +
      (this.endTime.day! + 7 > 31
        ? '0' + (this.endTime.day! + 7 - 31)
        : this.endTime.day!);

    const startTime =
      this.currentTime.year +
      '-' +
      this.currentTime.month +
      '-' +
      this.currentTime.day;
    const tag: SearchTag = {
      property: 'startTime',
      otherProperty: 'endTime',
      extraProperty: 'date',
      title: '产品日期',
      text: '本周',
      value: startTime,
      otherValue: endTime,
    };
    this.addtag(tag);
    this.isshowDate = true;
    this.startSearchTime = startTime;
    this.endSearchTime = endTime;
  }
  getMonth() {
    const endTime =
      (this.endTime.month == 12 ? this.endTime.year! + 1 : this.endTime.year) +
      '-' +
      (this.endTime.month! + 1 > 12 ? '01' : this.endTime.month! + 1) +
      '-' +
      '01';
    const startTime =
      this.currentTime.year + '-' + this.currentTime.month + '-' + '01';

    const tag: SearchTag = {
      property: 'startTime',
      otherProperty: 'endTime',
      extraProperty: 'date',
      title: '产品日期',
      text: '本月',
      value: startTime,
      otherValue: endTime,
    };

    this.addtag(tag);
    this.isshowDate = true;
    this.startSearchTime = startTime;
    this.endSearchTime = endTime;
  }
  myBtn() {
    this.isshowDate = false;
  }

  // 得到商品日期
  private dateFormater(formater: any, time?: any) {
    let date = time ? new Date(time) : new Date(),
      Y = date.getFullYear() + '',
      M = date.getMonth() + 1,
      D = date.getDate(),
      H = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
    return formater
      .replace(/YYYY|yyyy/g, Y)
      .replace(/YY|yy/g, Y.substr(2, 2))
      .replace(/MM/g, (M < 10 ? '0' : '') + M)
      .replace(/DD/g, (D < 10 ? '0' : '') + D)
      .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
      .replace(/mm/g, (m < 10 ? '0' : '') + m)
      .replace(/ss/g, (s < 10 ? '0' : '') + s);
  }
  // 根据生产日期搜索商品
  // private getProductByData(start: string, end: string): void {
  //   this.productCenterService
  //     .getList({
  //       currentPage: 1,
  //       pageRecord: 10,
  //       startTime: start,
  //       endTime: end,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     });
  // }

  // 动态添加组件
  addTab(componentName: string, id?: string) {
    const reuseTab: ReuseTab = { componentName, data: id ? { id } : undefined };
    this.reuseTabService.addTab(reuseTab, !!id);
  }
  // 选中分页后的回调
  pageChanged(event: { currentPage: number; pageRecord: number }) {
    const search: ProductCenterSearch = {
      currentPage: event.currentPage,
      pageRecord: event.pageRecord,
    };
    this.doSearch(undefined, search);
  }

  // 全选功能
  // 选中的状态
  checked!: boolean;
  // 未知状态
  indeterminate!: boolean;
  // 状态组
  checkedList: boolean[] = [];
  setOfCheckedId = new Set<string>();

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  refreshCheckedStatus(): void {
    this.checked = this.manualList.every((item) =>
      this.setOfCheckedId.has(item.id!)
    );
    this.indeterminate =
      this.manualList.some((item) => this.setOfCheckedId.has(item.id!)) &&
      !this.checked;
  }

  onAllChecked(checked: boolean) {
    this.manualList.forEach((item) => this.updateCheckedSet(item.id!, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(id: string, checked: boolean) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
}
