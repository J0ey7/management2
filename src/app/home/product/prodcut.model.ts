import { UploadContent } from '../../shared/models/upload-content.model';

// 产品品牌
export class Company {
  constructor(public id: number, public companyName: string) {}
}
//所有数据类
export class Item {
  constructor(
    public id: string,
    public dictCode: string,
    public serialNumber: number,
    public itemName: string,
    public itemCode: string,
    public pitemCode: string
  ) {}
}
// 树形控件类
export class NzTree {
  constructor(
    public title: string,
    public key: string,
    public expanded?: boolean,
    public isLeaf?: boolean,
    public pitemCode?: string,
    public itemCode?: string,
    public productCode?: string,
    public children?: Array<NzTree>
  ) {}
}
// 请求体
export class RequestBody {
  constructor(
    public id?: string,
    public currentPage?: number,
    public pageRecord?: number,
    public productCode?: string | undefined,
    public companyId?: string,
    public productName?: string
  ) {}
}

// 商品类
export class Product {
  constructor(
    public companyId?: string,
    public companyName?: string,
    public configIds?: Array<string>,
    public configList?: Array<Config>,
    public contentIds?: Array<string>,
    public contentList?: Array<UploadContent>,
    public imageList?: Array<UploadContent>,
    public id?: string,
    public img?: string,
    public introduction?: string,
    public manualName?: string,
    public manualNumber?: number,
    // 产品系列号
    public manualSerie?: string,
    public modelIds?: Array<any>,
    public modelList?: Array<Model>,
    public parameterList?: Array<any>,
    public pproductCode?: string,
    public pproductName?: string,
    public productCode?: string,
    public productName?: string
  ) {}
}
// 产品型号类
export class Model {
  constructor(
    public configIds?: unknown,
    public configList?: Array<Config>,
    public id?: string,
    public manualId?: string,
    public modelName?: string,
    public serialNumber?: number
  ) {}
}

// 产品型号参数类，
export class Config {
  constructor(
    public id?: string,
    public hostId?: string,
    public configvalueIds?: unknown,
    public configvalueList?: Array<ConfigvalueList>,
    public isMulti?: boolean,
    public multi?: boolean,
    public name?: string, // 配置名称
    public serialNumber?: number
  ) {}
}

export class ConfigvalueList {
  constructor(
    public configId?: string,
    public hostId?: string,
    public hostIds?: Array<string>,
    public id?: string,
    public serialNumber?: number,
    public value?: string
  ) {}
}
// 所有产品参数类
export class ParamsList {
  constructor(public name: string, public value?: string[]) {}
}
