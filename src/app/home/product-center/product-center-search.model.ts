import { BaseSearch } from '../../shared/models/base-search.model';
export class ProductCenterSearch extends BaseSearch {
  serialNumber?: string;
  startTime?: string | undefined;
  endTime?: string | undefined;
  companyId?: string;
  name?: string;
  productCode?: string;
  pageRecord: number = 6;
  // key值
  [key: string]: any;
}

export class imporSearch {
  manualId?: string;
  modelId?: string;
  productDate?: string;
  serialNumber?: string;
  valueIds?: string;
}
