import { DictionaryService } from './../../../shared/services/dictionary.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Manual, ManualModel } from './../manual.model';
import * as _ from 'lodash';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import {
  Company,
  Dictionary,
  Result,
  UploadContent,
} from 'src/app/shared/models';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CompanyService } from 'src/app/shared/services';
import { ManualService } from '../manual.service';
import { ReuseTabService } from 'src/app/layout/reuse-tabset/reuse-tab.service';
// UeEditor
declare const UE: any;
@Component({
  selector: 'app-manual-handle',
  templateUrl: './manual-handle.component.html',
  styleUrls: ['./manual-handle.component.less'],
  providers: [NzModalService, NzMessageService],
})
export class ManualHandleComponent implements OnInit, AfterViewInit {
  // 动态组件传入的值
  @Input() data: { id: string } = { id: '' };
  // 页面绑定的数据
  manual: Manual = { modelList: [], configList: [] };
  // 产品型号模态框开关
  isModelModalVisible: boolean = false;
  // 当前编辑的型号
  currentManualModel!: ManualModel;
  // 当前选中的型号下标
  selectedModelIndex: number = -1;
  // 上传的图片文件
  fileList: NzUploadFile[] = [];
  // 公司品牌
  companyList: Array<Company> = [];
  // 产品分类 父级
  productTypeList: Array<Dictionary> = [];
  // ueEditor
  ueEidtor!: any;

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private companyService: CompanyService,
    private dictionaryService: DictionaryService,
    private manualService: ManualService,
    private tabService: ReuseTabService
  ) {}
  ngAfterViewInit(): void {
    this.ueEidtor = UE.getEditor('editor');
  }

  ngOnInit(): void {
    this.getCompanyList();
    this.getManualType();
    this.test();
  }
  private test() {
    this.manual = {
      manualSerie: 'test001',
      manualName: '测试001',
      companyId: '2',
      productCode: '0102',
      pproductCode: '01',
      modelList: [],
      configList: [],
    };
  }
  // 移除型号
  removeModel(model: any) {}

  // 添加产品型号
  addModel() {
    this.isModelModalVisible = true;
    this.currentManualModel = { modelName: '', configList: [] };
  }
  // 模型编辑操作
  modelHandleEdit() {}
  // 编辑产品型号
  editModel(model: ManualModel, index: number) {
    return () => {
      this.currentManualModel = _.cloneDeep(model);
      this.selectedModelIndex = index;
      this.isModelModalVisible = true;
    };
  }

  // 保存产品型号
  saveModel(model: ManualModel) {
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
    this.isModelModalVisible = false;
    this.currentManualModel = { modelName: '' };
    this.selectedModelIndex = -1;
  }

  // 图片文件上传处理
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

  // 保存手册
  save() {
    // 获取ueditor 的值，并赋给产品介绍
    this.manual.introduction = this.ueEidtor.getContent();
    console.log(this.manual);
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确认保存吗？',
      nzOnOk: () => {
        this.manualService
          .save(this.manual)
          .then(() => {
            this.modalService.success({
              nzTitle: '提示',
              nzContent: '保存成功',
              nzOnOk: () => {
                this.cancel();
                this.tabService.addTab(
                  { componentName: 'ManualListComponent' },
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
  cancel() {
    this.tabService.removeTab({ componentName: 'ManualAddComponent' });
  }
  // 获取品牌列表
  private getCompanyList() {
    this.companyService.getList().then((res) => {
      this.companyList = res;
    });
  }

  /**
   * 获取全部分类
   */
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
}
