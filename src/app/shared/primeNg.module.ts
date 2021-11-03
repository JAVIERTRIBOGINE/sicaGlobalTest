import { NgModule } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar'
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TabMenuModule } from 'primeng/tabmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { ChipsModule } from 'primeng/chips';
import { FieldsetModule } from 'primeng/fieldset';
import { OrderListModule } from 'primeng/orderlist';
import { CalendarModule } from 'primeng/calendar';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { FileUploadModule } from 'primeng/fileupload';
import { PickListModule } from 'primeng/picklist';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DragDropModule } from 'primeng/dragdrop';
import { PanelModule } from 'primeng/panel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';

@NgModule({
  exports: [
    MenuModule,
    MenubarModule,
    ToolbarModule, 
    InputTextModule, 
    ButtonModule, 
    TabViewModule, 
    TableModule, 
    CascadeSelectModule,
    TabMenuModule,
    MultiSelectModule,
    OverlayPanelModule,
    AccordionModule,
    ChipsModule,
    FieldsetModule,
    OrderListModule,
    CalendarModule,
    TriStateCheckboxModule,
    FileUploadModule,
    PickListModule,
    DynamicDialogModule,
    DragDropModule,
    PanelModule,
    InputSwitchModule,
    SliderModule
  ],
})
export class PrimeNgModule {}
