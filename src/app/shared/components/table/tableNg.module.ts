import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {ToastModule} from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'primeng/splitbutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {FormsModule} from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { OrderListModule } from 'primeng/orderlist';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsNgModule } from '../formsNg/formsNg.module';
import { MasterFormsNgModule } from '../master-formsNg/master-formsNg.module';
import { ModalFormsNgComponent } from 'src/app/shared/components/modalFormsNg/modalFormsNg.component';
import { SimpleContainerModalComponent } from '../simple-container-modal/simple-container-modal.component';



@NgModule({
  imports: [ FormsNgModule, MasterFormsNgModule, InputSwitchModule, CommonModule,TableModule, InputTextModule, ButtonModule, ToastModule, TranslateModule.forChild(), 
    CheckboxModule, TriStateCheckboxModule, RouterModule, SplitButtonModule, MultiSelectModule, FormsModule, OverlayPanelModule, OrderListModule], 
  declarations: [ ModalFormsNgComponent, TableComponent, SimpleContainerModalComponent],
  exports: [ ModalFormsNgComponent, TableComponent, TranslateModule],
  entryComponents: [ModalFormsNgComponent,SimpleContainerModalComponent]
  
})
export class TableNgModule {}
