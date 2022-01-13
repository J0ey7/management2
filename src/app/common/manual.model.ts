import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UploadContent } from 'src/app/shared/models';

/**
 * 产品手册
 */
export interface Manual {
    companyId?: string;
    companyName?: string;
    configIds?: Array<string>;
    configList: Array<ManualModelConfig>;
    contentIds?: Array<string>;
    contentList?: Array<UploadContent>;
    imageList?: Array<UploadContent>;
    id?: string;
    img?: string;
    introduction?: string;
    manualName?: string;
    manualNumber?: number;
    manualSerie?: string;
    modelIds?: Array<any>;
    modelList: Array<ManualModel>;
    parameterList?: Array<any>;
    pproductCode?: string;
    pproductName?: string;
    productCode?: string;
    productName?: string;
}
/**
 *  产品手册--产品型号
 */
export interface ManualModel {
    configIds?: unknown;
    configList?: Array<ManualModelConfig>;
    id?: string;
    manualId?: string;
    modelName: string;
    serialNumber?: number;
}

/**
 * 产品手册--产品型号配置项
 */
export interface ManualModelConfig {
    id?: string;
    hostId?: string;
    configvalueIds?: unknown;
    configvalueList: Array<ManualModelConfigValue>;
    isMulti: boolean;
    multi?: boolean;
    name: string; // 配置名称
    serialNumber?: number;
}
/**
 * 产品手册--产品型号配置项实际的值
 */
export interface ManualModelConfigValue {
    configId?: string;
    hostId?: string;
    hostIds?: Array<string>;
    id?: string;
    serialNumber?: number;
    value: string;
}
