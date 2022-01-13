/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HandleTableTplComponent } from './handle-table-tpl.component';

describe('HandleTableTplComponent', () => {
  let component: HandleTableTplComponent;
  let fixture: ComponentFixture<HandleTableTplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandleTableTplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleTableTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
