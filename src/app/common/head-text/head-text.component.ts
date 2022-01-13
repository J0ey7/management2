import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-head-text',
  templateUrl: './head-text.component.html',
  styleUrls: ['./head-text.component.css'],
})
export class HeadTextComponent implements OnInit {
  @Input() panelTitle: string = '';
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  constructor() {}
  save() {
    this.onSave.emit('dd');
  }
  ngOnInit() {}
}
