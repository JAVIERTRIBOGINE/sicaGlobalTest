import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditComponent } from './audit.component';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [AuditComponent],
  imports: [
    CommonModule, DropdownModule, FormsModule, TranslateModule.forChild(),
  ],
  exports: [AuditComponent]
})
export class AuditModule { }
