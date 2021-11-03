import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

@NgModule({
  declarations: [ HeaderComponent],
  imports: [CommonModule, DropdownModule, TranslateModule.forChild(), SharedModule
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
