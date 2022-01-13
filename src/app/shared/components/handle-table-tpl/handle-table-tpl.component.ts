import { Component, OnInit, Input } from '@angular/core';
import { HandleTableItem } from '../../models/handle-table-item.model';
@Component({
  selector: 'app-handle-table-tpl',
  templateUrl: './handle-table-tpl.component.html',
  styleUrls: ['./handle-table-tpl.component.css'],
})
export class HandleTableTplComponent implements OnInit {
  @Input() dataList: Array<Array<HandleTableItem>> = [];
  constructor() {}

  ngOnInit() {}
}
