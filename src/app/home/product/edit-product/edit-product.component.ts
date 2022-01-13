import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ManualService } from '../manual.service';
import { DictionaryService } from '../../../shared/services/dictionary.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Product, Model } from '../prodcut.model';
import { Dictionary } from '../../../shared/models/dictionary.model';
import { Company } from '../../../shared/models/company.model';
import { CompanyService } from '../../../shared/services/company.service';
import { UploadContent } from '../../../shared/models/upload-content.model';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Result } from '../../../shared/models/result.model';
// 库的服务
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

// 动态组件
import { ReuseTabService } from '../../../layout/reuse-tabset/reuse-tab.service';
// UeEditor
declare const UE: any;
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  providers: [NzModalService, NzMessageService],
})
export class EditProductComponent implements OnInit, AfterViewInit, OnDestroy {
  // 商品id
  // id!: string;
  // 动态组件传入的值
  @Input() data: { id: string } = { id: '' };
  // 是否出现型号框
  isShowModal: boolean = false;
  // 当前选中的型号下标
  selectedModelIndex: number = -1;
  // 初始化当前商品
  currentModel: Model = { modelName: '', configList: [] };
  // 上传的图片文件
  fileList: NzUploadFile[] = [];
  baseImg: string = 'http://localhost:4200/';
  // 初始化商品数据，让其选择后改变
  manual: Product = { modelList: [], configList: [] };
  // 公司品牌
  companyList!: Company[];
  // 产品分类
  productTypeList!: Dictionary[];
  // 产品图片
  imgList: Array<any> = [];
  //  ueEditor
  ueEidtor!: any;

  constructor(
    private manualService: ManualService,
    private route: ActivatedRoute,
    private dictionaryService: DictionaryService,
    private companyService: CompanyService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private router: Router,
    private reuseTabService: ReuseTabService
  ) {
    // 通过路由获取id
    // this.route.queryParams.subscribe((queryParams) => {
    //   this.id = queryParams.id;
    // });
  }
  ngOnDestroy(): void {
    // 销毁ueditor实例
    this.ueEidtor.destroy();
  }

  ngOnInit() {
    this.getManul();
    this.getManualType();
    this.getCompanyList();
    this.getNzUploadFile();
  }
  ngAfterViewInit(): void {
    this.ueEidtor = UE.getEditor('editor1');
  }
  // 添加商品型号
  addModel() {
    this.isShowModal = true;
    this.currentModel = { modelName: '', configList: [] };
  }
  editModel(model: Model, index: number) {
    return () => {
      this.currentModel = _.cloneDeep(model);
      this.selectedModelIndex = index;
      this.isShowModal = true;
    };
  }

  // 保存商品信息
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
  // 图片上传
  imgUploadChange(params: NzUploadChangeParam) {
    let uploadResult: boolean = false;
    let msg: string = '上传失败，请稍后重试';
    const file = params.file;
    // 上传完成
    if (file.status === 'done') {
      const response: Result<UploadContent> = file.response;
      if (response.rlt == 0) {
        uploadResult = true;
        // 关键：需要传递id contentType
        const upload: UploadContent = response.datas;
        file.id = upload.id;
        upload.contentType = 0;
        file.url = `/${upload.filePath}/${upload.storeName}`;
        if (!this.manual.contentList) this.manual.contentList = [];
        if (!this.manual.imageList) this.manual.imageList = [];
        this.manual.imageList.push(upload);
        this.manual.contentList.push(upload);
      } else {
        if (response.info) msg = response.info;
      }
      uploadResult ? this.message.success('上传成功') : this.message.error(msg);
    } // 其他异常情况
    else if (file.status === 'error') {
      msg = `code:${(file.error && file.error.status) || 'unknown'}:${
        file.message
      }`;
      this.message.error(msg);
    }
  }

  // 获取特定商品信息
  private getManul(): void {
    this.manualService.getInfo(this.data.id).then((res) => {
      this.manual = res;
      console.log(this.manual);

      this.ueEidtor.ready(() => {
        this.ueEidtor.setContent(this.manual.introduction);
      });
    });
  }
  // 请求商品品牌信息
  private getCompanyList(): void {
    this.companyService.getList().then((res) => {
      this.companyList = res;
      console.log(this.companyList);
    });
  }

  // 获取全部分类
  private getManualType(): void {
    const mlzlList = this.dictionaryService.getDicListByCode('DM_MLZL');
    const cpzlList = this.dictionaryService.getDicListByCode('DM_CPZL');
    Promise.all([mlzlList, cpzlList]).then(([mlzlList, cpzlList]) => {
      this.productTypeList = mlzlList.map((ele) => {
        ele.children = cpzlList.filter((e) => e.pitemCode == ele.itemCode);
        return ele;
      });
    });
  }

  cancel() {
    // this.router.navigate(['/product']);
    // 跳回首页
    this.reuseTabService.removeTab({
      componentName: 'EditProductComponent',
    });
  }

  delete() {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确认删除吗',
      nzOnOk: () => {
        this.manualService
          .delete(this.data.id)
          .then(() => {
            this.modalService.success({
              nzTitle: '提示',
              nzContent: '删除成功',
              nzOnOk: () => {
                this.cancel();
                this.reuseTabService.addTab(
                  { componentName: 'ProductComponent' },
                  true
                );
              },
            });
          })
          .catch((err) => {
            this.modalService.error({
              nzTitle: '提示',
              nzContent: err || '删除失败',
            });
          });
      },
    });
    console.log(123);
  }
  save() {
    // 获取ueditor 的值，并赋给产品介绍

    this.manual.introduction = this.ueEidtor.getContent();
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确认保存吗',
      nzOnOk: () => {
        this.manualService.save(this.manual).then(() => {
          this.modalService.success({
            nzTitle: '提示',
            nzContent: '保存成功',
            nzOnOk: () => {
              this.cancel();
              this.reuseTabService.addTab(
                { componentName: 'ProductComponent' },
                true
              );
            },
          });
        });
      },
    });
    console.log(this.manual);
  }
  // 初始化image
  getNzUploadFile(): void {
    this.manualService.getInfo(this.data.id).then((res) => {
      // 初始化商品图片
      if (res.contentList && res.contentList.length) {
        this.fileList = res.contentList.map((item) => {
          return {
            uid: item.id!,
            name: item.fullName!,
            status: 'done',
            url: this.baseImg + item.filePath + '/' + item.storeName,
          };
        });
      }
    });
  }
}
