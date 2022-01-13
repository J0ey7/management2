import { BaseSearch, Company } from '../../shared/models';

export class ManualSearch extends BaseSearch {
  pageRecord: number = 6;
  company?: Company;
  companyId?: string; // 产品品牌id
  name?: string; // 产品名称
  productCode?: string; // 产品种类
  [key: string]: any;
}
