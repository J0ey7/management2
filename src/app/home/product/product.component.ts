import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { Item, NzTree, RequestBody } from '../module';
import { Product } from './prodcut.model';
import { Company } from '../../shared/models/company.model';
//   请求体
import { ManualSearch } from './manul-search.model';
// 搜索标签的类型
import { ManualService } from '../product/manual.service';
import { SearchTag } from '../../shared/models/search-tag.model';
import { Page } from '../../shared/models/page.model';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

// 动态组件类型
import { ReuseTab } from '../../layout/reuse-tabset/tab.model';
import { ReuseTabService } from '../../layout/reuse-tabset/reuse-tab.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  constructor(
    private router: Router,
    private productService: ProductService,
    private manualService: ManualService,
    private reuseTabService: ReuseTabService
  ) {}

  companys: Company[] = [];
  // 选择框的数据
  selectCompany!: string;
  categoryTitle!: Item[];
  childTitle!: Item[];
  products!: Product[];
  title: string | undefined;

  baseUrl: string = 'http://localhost:8081/';
  // 商品请求体
  requestBody!: RequestBody;
  // 根据名字搜索数据
  searchName!: string;
  // 当前页数
  nzPageIndex!: number;
  // 每页条数
  nzPageSize!: number;
  // 总页数
  nzTotal!: number;
  // 树形控件展开
  expand: boolean = true;

  // 页面数据
  nzSpinning: boolean = false;
  page!: Page<Product>;
  //手册页请求体统一
  manualSearch: ManualSearch = new ManualSearch();
  // 当前页面搜索标签
  tags: Array<SearchTag> = [];
  // 隐藏得搜索标签
  _tags: Array<SearchTag> = [];

  nodes: NzTree[] = [
    {
      title: '全部分类',
      key: '00',
      expanded: true,
      children: [],
    },
  ];
  nodes1!: NzTree[];

  ngOnInit() {
    this.getCompanys();
    this.getCategoryTitle('DM_MLZL');
    this.getCategoryTitle('DM_CPZL');
    this.getProduct({
      currentPage: 1,
      pageRecord: 6,
    });
    this.getList(this.manualSearch);
  }

  // 获取商品品牌数据
  getCompanys(): void {
    this.productService
      .getCompanys()
      .subscribe((datas) => (this.companys = datas.datas));
  }

  // 获取分类标题
  getCategoryTitle(params: string): void {
    this.productService.getItems().subscribe((datas) => {
      if (params === 'DM_MLZL') {
        this.categoryTitle = datas.datas.filter(
          (item: Item) => item.dictCode === params
        );

        this.categoryTitle.forEach((item) => {
          let nzTreeItem: NzTree = {
            title: item.itemName,
            key: item.itemCode,
            itemCode: item.itemCode,
            expanded: false,
            children: [],
          };
          this.nodes[0].children?.push(nzTreeItem);
        });
      } else if (params === 'DM_CPZL') {
        this.childTitle = datas.datas.filter(
          (item: Item) => item.dictCode === params
        );
        // 已经添加了一级分类

        this.nodes[0].children?.forEach((item) => {
          // console.log(item);
          this.childTitle.forEach((child) => {
            let nzTreeItem: NzTree = {
              title: child.itemName,
              key: child.itemCode,
              pitemCode: child.pitemCode,
              itemCode: child.itemCode,
              // productCode: child.productCode,
              expanded: false,
              isLeaf: true,
              children: [],
            };

            if (item.itemCode === child.pitemCode) {
              item.children?.push(nzTreeItem);
            }
          });
          // this.categoryTitle.forEach((far) => {
          //   this.childTitle.forEach((child) => {
          //     let nzChildItem: NzTree = {
          //       title: child.itemCode,
          //       key: child.itemCode,
          //       pitemCode: child.pitemCode,
          //       expanded: false,
          //       children: [],
          //     };
          //   });
          // });
        });
        this.nodes1 = this.nodes;
      }
    });
  }
  // 获取商品的数据
  getProduct(params: RequestBody): void {
    this.productService.getProduct(params).subscribe((datas) => {
      const data = datas.datas;
      this.products = data.result;
      // this.nzPageIndex = data.currentPage;
      // this.nzTotal = data.pageRecord;
      // this.nzPageSize = data.pageTwo;
    });
  }

  // 路由跳转
  // addProduct(): void {
  //   // 这里的router是构造器里声明的router，跳转通过navigate()
  //   //传参：第一个是路由路径,第二个是跳转携带的参数
  //   // (注意需在路由配置里带上参数如下：
  //   //   {path: 'detail/:id',component: detailComponent}
  //   //   )
  //   //要在路由配置里带上参数，这里才可以带上参数(格式须一致)
  //   this.router.navigate(['/addProduct']);
  //   console.log(this.childTitle);
  // }

  // 获取所有数据
  getList(search: ManualSearch) {
    this.nzSpinning = true;
    this.manualService
      .getList(search)
      .then((res) => {
        this.page = res;
        console.log(this.page);

        this.nzSpinning = false;
      })
      .catch(() => {
        this.nzSpinning = false;
      });
  }

  // 移除tag搜索标签
  removeTag(tag: SearchTag) {
    //  获取对应的标签
    const index = this.getTagIndex(tag.property);
    this.tags.splice(index, 1);
    this._removeTag(tag);
    this.manualSearch[tag.property] = undefined;
    if (tag.extraProperty) {
      this.manualSearch[tag.extraProperty] = undefined;
    }
    this.manualSearch.productName = '';
    this.doSearch();
  }

  // 移除隐藏的搜索标签
  private _removeTag(tag: SearchTag) {
    const index = this._tags.findIndex((ele) => ele.property === ele.property);
    if (index > -1) {
      this._tags.splice(index, 1);
    }
  }

  // 搜索操作
  private doSearch(tag?: SearchTag, search?: ManualSearch) {
    // 单项搜索：隐藏其他的搜索条件
    if (!search) search = new ManualSearch();
    if (tag) {
      this.tags.forEach((ele) => (ele.hide = tag.property !== ele.property));
      search[tag.property] = tag.value;
    } else {
      // 找到搜索条件未隐藏的选项
      this.tags.forEach((ele) => {
        if (!ele.hide) {
          search![ele.property] = ele.value;
        }
      });
    }
    this.getProduct(search);
  }
  // 检查当前搜索条件是否存在
  private getTagIndex(property: string): number {
    // findindex方法是搜索符合条件的数的第一个索引值
    return this.tags.findIndex((ele) => ele.property == property);
  }

  // 添加标签
  addTag(tag: SearchTag) {
    const index = this.getTagIndex(tag.property);
    if (index == -1) {
      if (tag.value) {
        // this.tags中没有这个搜索条件
        this.tags.push(tag);
      }
    } else {
      this.tags.splice(index, 1, tag);
    }
    this.doSearch(tag);
  }
  // 点击分类
  nzEvent(event: NzFormatEmitEvent): void {
    this.title = event.node?.title;
    // 根据分类名获取分类数据
    // this.getProduct({
    //   currentPage: 1,
    //   pageRecord: 15,
    //   productCode: event.node?.origin.itemCode,
    // });
    this.manualSearch.productCode = event.node?.origin.itemCode;
    const tag: SearchTag = {
      property: 'productCode',
      title: '产品分类 ',
      text: event.node?.origin.title,
      value: event.node?.origin.itemCode,
    };
    this.addTag(tag);

    console.log(tag);
  }

  // 点击品牌切换数据
  getCompanysById(event: Company, property: string): void {
    // this.getProduct({
    //   currentPage: 1,
    //   pageRecord: 15,
    //   companyId: event.id,
    // });
    this.manualSearch.companyId = event.id;
    const tag: SearchTag = {
      property,
      extraProperty: 'company',
      title: '产品品牌',
      text: event?.companyName,
      value: event?.id,
    };
    this.addTag(tag);
  }
  // 输入框输入的隐藏标签
  onInputChange($event: KeyboardEvent) {
    const target: any = $event.target;
    const tag: SearchTag = {
      property: 'name',
      title: '产品名称',
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

  // 点击查询
  search(value: string, property: string) {
    // 构建 tag 实体类
    const tag: SearchTag = { property, value, text: value, title: '产品名称' };
    this.addTag(tag);
  }
  // 进行全部的查询
  doAllSearch() {
    const tags = this.tags.concat(this._tags);
    console.log(tags);

    const search: ManualSearch = new ManualSearch();
    this.tags = [];
    console.log(this.tags);

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
    this.getProduct(search);
  }
  // 清除所有标签
  clearSearch() {
    this.manualSearch = new ManualSearch();
    this.tags = [];
    this._tags = [];
    this.getProduct(this.manualSearch);
  }

  pageChanged(event: { currentPage: number; pageRecord: number }) {
    const search: ManualSearch = {
      currentPage: event.currentPage,
      pageRecord: event.pageRecord,
    };
    this.doSearch(undefined, search);
  }

  // 动态加载组件，添加页面
  addTab(componentName: string, id?: string) {
    const reuseTab: ReuseTab = { componentName, data: id ? { id } : undefined };
    this.reuseTabService.addTab(reuseTab, !!id);
  }
}
