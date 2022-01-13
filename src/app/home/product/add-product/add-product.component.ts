import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CompanyService } from '../../../shared/services/company.service';
import { DictionaryService } from '../../../shared/services/dictionary.service';
import { Router } from '@angular/router';

import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

import * as _ from 'lodash';
// 共享类型
import {
  Company,
  Dictionary,
  Result,
  UploadContent,
} from '../../../shared/models';
import { ManualService } from '../manual.service';
import { Model, Product } from '../prodcut.model';
import { ReuseTabService } from '../../../layout/reuse-tabset/reuse-tab.service';

// UeEditor
declare const UE: any;

// 第三方编辑库

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [NzModalService, NzMessageService],
})
export class AddProductComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
    private companyService: CompanyService,
    private dictionaryService: DictionaryService,
    private manualService: ManualService,
    private reuseTabService: ReuseTabService
  ) {}
  // 初始化商品数据，让其选择后改变
  manual: Product = { modelList: [], configList: [] };
  // 初始化商品型号
  currentModel: Model = { modelName: '', configList: [] };
  // 依靠选中的模型下标判断是否为编辑模式
  selectedModelIndex: number = -1;
  // 产品型号模态框开关
  isShowModal: boolean = false;
  // 上传的文件列表
  fileList: NzUploadFile[] = [];
  // 公司品牌
  companyList: Array<Company> = [];
  // 产品分类
  productTypeList!: Dictionary[];
  //  ueEditor
  ueEidtor!: any;

  ngOnInit() {
    this.getCompanyList();
    this.getManualType();
  }
  ngAfterViewInit(): void {
    this.ueEidtor = UE.getEditor('editor');
  }
  // 添加商品型号
  addModel() {
    this.isShowModal = true;
    this.currentModel = { modelName: '', configList: [] };
  }
  // 保存时，左侧按钮编辑形式
  editModel(model: Model, index: number) {
    return () => {
      this.currentModel = _.cloneDeep(model);
      this.selectedModelIndex = index;
      this.isShowModal = true;
    };
  }

  // 保存商品型号
  saveModel(model: Model) {
    if (model) {
      // 新增或者编辑操作
      if (this.selectedModelIndex > -1) {
        this.manual.modelList?.splice(this.selectedModelIndex, 1, model);
      } else {
        const isExist =
          this.manual.modelList!.findIndex(
            (ele) => ele.modelName == model.modelName
          ) > -1;
        if (isExist) {
          this.modalService.info({
            nzTitle: '提示',
            nzContent: '产品型号名称重复',
          });
          return;
        }
        this.manual.modelList!.push(model);
      }
    } else {
      // 删除操作
      this.manual.modelList?.splice(this.selectedModelIndex, 1);
    }
    this.isShowModal = false;
    this.currentModel = { modelName: '' };
    this.selectedModelIndex = -1;
  }
  // 上传图片处理
  imgUploadChange(params: NzUploadChangeParam) {
    let uploadResult: boolean = false;
    let msg: string = '上传失败，请稍后重试';
    const file = params.file;

    // 上传完成
    if (file.status === 'done') {
      const response: Result<UploadContent> = file.response;
      if (response.rlt == 0) {
        uploadResult = true;
        // 上传到本地的内容
        const upload: UploadContent = response.datas;
        file.id = upload.id;
        upload.contentType = 0;
        file.url = `/${upload.filePath}/${upload.storeName}`;
        //判断内容是否存在，先进行初始化
        if (!this.manual.contentList) this.manual.contentList = [];
        if (!this.manual.imageList) this.manual.imageList = [];
        this.manual.imageList.push(upload);
        this.manual.contentList.push(upload);
      } else {
        if (response.info) msg = response.info;
      }
      uploadResult ? this.message.success('上传成功') : this.message.error(msg);
      // 其他异常情况
    } else if (file.status === 'error') {
      msg = `code:${(file.error && file.error.status) || 'unknown'}:${
        file.message
      }`;
      this.message.error(msg);
    }
  }
  // 新增保存手册
  save() {
    // 获取ueditor 的值，并赋给产品介绍
    this.manual.introduction = this.ueEidtor.getContent();
    // 利用nzmodal的服务
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确认保存吗',
      nzOnOk: () => {
        this.manualService
          .save(this.manual)
          .then(() => {
            this.modalService.success({
              nzTitle: '提示',
              nzContent: '保存成功',
              nzOnOk: () => {
                this.cancel();
                this.reuseTabService.addTab(
                  {
                    componentName: 'ProductComponent',
                  },
                  true
                );
              },
            });
          })
          .catch((err) => {
            this.modalService.error({
              nzTitle: '提示',
              nzContent: err || '保存失败',
            });
          });
      },
    });
  }
  // 取消
  cancel() {
    // 路由方式
    // this.router.navigate(['/product']);
    // 动态组件方式
    this.reuseTabService.removeTab({ componentName: 'AddProductComponent' });
  }

  // 获取商品品牌
  private getCompanyList() {
    this.companyService.getList().then((res) => {
      this.companyList = res;
      console.log(this.companyList);
    });
  }

  // 获取全部分类
  private getManualType() {
    const mlzl = this.dictionaryService.getDicListByCode('DM_MLZL');
    const cpzl = this.dictionaryService.getDicListByCode('DM_CPZL');
    Promise.all([mlzl, cpzl]).then(([mlzlList, cpzlList]) => {
      this.productTypeList = mlzlList.map((ele) => {
        ele.children = cpzlList.filter((e) => e.pitemCode == ele.itemCode);
        return ele;
      });
    });
  }
}
