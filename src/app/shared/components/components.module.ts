import { NgModule } from '@angular/core';
import { TableNgModule } from './table/tableNg.module';
import { BreadcrumbNgModule } from './breadcrumb/breadcrumbNg.module';
import { FormsNgModule } from './formsNg/formsNg.module';
import { SearchFormsNgModule } from './search-formsNg/search-formsNg.module';
import { AuditModule } from './audit/audit.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';


@NgModule({
  imports: [TableNgModule, BreadcrumbNgModule, FormsNgModule, AuditModule, SearchFormsNgModule,OverlayPanelModule],
  exports: [TableNgModule, BreadcrumbNgModule, FormsNgModule, AuditModule, SearchFormsNgModule, OverlayPanelModule],
  declarations: [],
  providers: []
})
export class ComponentsModule {}
