import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tab-host]'
})
export class TabContainerDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
