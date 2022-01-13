import { UploadContent } from '../../shared/models/upload-content.model';
// 产品品牌
export class Company {
  constructor(public id: number, public companyName: string) {}
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
    public manualId?: string,
    public modelId?: string,
    public serialNumber?: string,
    public productDate?: string,
    public name?: string,
    public valueIds?: string,
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
    public serialNumber?: number,
    public dynamic?: boolean
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
    public serialNumber?: number,
    public dynamic?: boolean
  ) {}
}
// 产品型号里的值
export class ConfigvalueList {
  constructor(
    public configId?: string,
    public hostId?: string,
    public hostIds?: Array<string>,
    public id?: string,
    public serialNumber?: number,
    public value?: string,
    public dynamic?: boolean
  ) {}
}

// 产品名称
export class ProductCenterName {
  constructor(public name?: string, public id?: string) {}
}

export class ProductData {
  constructor(
    public year?: number,
    public month?: number,
    public day?: number,
    public startTime?: string,
    public endTime?: string
  ) {}
}

export type modelALl = Model | Config | ConfigvalueList;
