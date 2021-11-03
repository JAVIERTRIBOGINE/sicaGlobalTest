import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditGlobalComponent } from './edit-global.component';
import { EditGlobalRoutingModule } from './edit-global-routing.module';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [CommonModule, EditGlobalRoutingModule, DynamicDialogModule, ToastModule, SharedModule
  ],
  declarations: [EditGlobalComponent],
  exports: [EditGlobalComponent],
})
export class EditGlobalModule {}
