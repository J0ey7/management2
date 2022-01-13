import { Type } from "@angular/core";

export interface ReuseTab {
    uuid?: string;
    title?: string;
    data?: any;
    closeable?: boolean;
    componentName?: string;
    component?: Type<any>;
}