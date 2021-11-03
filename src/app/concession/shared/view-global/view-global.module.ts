import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewGlobalComponent } from './view-global.component';
import { ViewGlobalRoutingModule } from './view-global-routing.module';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [CommonModule, ViewGlobalRoutingModule, DynamicDialogModule, ToastModule, SharedModule
  ],
  declarations: [ViewGlobalComponent],
  exports: [ViewGlobalComponent],
})
export class ViewGlobalModule {}
