import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbNgComponent } from './breadcrumbNg.component';
 import {BreadcrumbModule} from 'primeng/breadcrumb';

@NgModule({
  imports: [CommonModule,BreadcrumbModule],
  declarations: [BreadcrumbNgComponent],
  exports: [BreadcrumbNgComponent],
})
export class BreadcrumbNgModule {}
