import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteGlobalComponent } from './delete-global.component';
import { ViewGlobalRoutingModule } from './delete-global-routing.module';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [CommonModule, ViewGlobalRoutingModule, DynamicDialogModule, ToastModule, SharedModule
  ],
  declarations: [DeleteGlobalComponent],
  exports: [DeleteGlobalComponent],
})
export class DeleteGlobalModule {}
