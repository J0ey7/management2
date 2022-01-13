export type handleTableControlType = 'input' | 'select' | 'data';
export interface HandleTableItem {
  //标签名
  lable: string;
  controlType: handleTableControlType;
  property: string;
}
