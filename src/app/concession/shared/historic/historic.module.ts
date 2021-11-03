import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricComponent } from './historic.component';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [CommonModule, DynamicDialogModule, ToastModule, SharedModule,
  RouterModule.forChild([{path: '', component: HistoricComponent}])
  ],
  declarations: [HistoricComponent],
  exports: [HistoricComponent],
})
export class HistoricModule {}
