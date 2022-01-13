import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
// 头部公用
import { HeadTextModule } from '../common/head-text/head-text.module';
import { SharedModule } from '../shared/share.module';

@NgModule({
  imports: [HeadTextModule, RouterModule, SharedModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
