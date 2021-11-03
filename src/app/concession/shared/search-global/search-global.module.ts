import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { SearchGlobalComponent } from './search-global.component';
import { SearchGlobalRoutingModule } from './search-global-routing.module';
import { DynamicDialogModule} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [ CommonModule, SearchGlobalRoutingModule, DynamicDialogModule, ToastModule, SharedModule
  ],
  declarations: [SearchGlobalComponent],
  exports: [SearchGlobalComponent],
  providers: [DatePipe, DecimalPipe]
})
export class SearchGlobalModule {}
