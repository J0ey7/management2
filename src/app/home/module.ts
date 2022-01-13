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
    public name?: string
  ) {}
}

// 商品类
export class Product {
  constructor(
    public id: string,
    public pproductCode: string,
    public pproductName: string,
    public productCode: string,
    public productName: string,
    public companyId: string,
    public companyName: string,
    public manualSerie: string,
    public manualName: string,
    public introduction: string,
    public img?: string,
    public modelList?: Array<any>,
    public modelIds?: null,
    public configList?: Array<any>,
    public configIds?: null,
    public contentList?: Array<any>,
    public contentIds?: null,
    public parameterList?: null
  ) {}
}
// 产品型号类
export class model {
  constructor(
    public id?: string,
    public manualId?: string,
    public serialNumber?: number,
    public modelName?: string,
    public configList?: Array<Config>,
    public configIds?: unknown
  ) {}
}

// 产品型号参数类，
export class Config {
  constructor(
    public configvalueIds?: null,
    public configvalueList?: Array<ConfigvalueList>,
    public hostId?: string,
    public id?: string,
    public isMulti?: boolean,
    public multi?: boolean,
    public name?: string,
    public serialNumber?: null
  ) {}
}

export class ConfigvalueList {
  constructor(
    public id?: string,
    public configId?: string,
    public hostId?: string,
    public value?: string,
    public serialNumber?: number
  ) {}
}
// 所有产品参数类
export class ParamsList {
  constructor(public name: string, public value?: string[]) {}
}
