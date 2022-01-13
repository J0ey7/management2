export class SearchTag {
  title?: string; // 搜素条件标题
  text?: string; // 搜索条件显示的text （页面显示的数据）
  value?: string; // 搜索条件对应value （传递到后台的数据）
  property: string; // 搜搜条件属性 （传递到后台的字段）
  otherProperty?: string; //其他的搜索条件，
  otherValue?: string; //其他搜索条件的值
  extraProperty?: string; // 额外附属的属性 （例如select 这种）
  hide?: boolean; // 是否隐藏
  constructor(property: string, otherProperty: string) {
    this.property = property;
    this.otherProperty = otherProperty;
  }
}
