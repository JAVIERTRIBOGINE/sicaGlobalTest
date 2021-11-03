import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderModule } from 'src/app/shared/layout/header/header.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, AdminRoutingModule, HttpClientModule, SharedModule,
    TranslateModule.forChild(), HeaderModule
],
  exports: [TranslateModule]
})
export class AdminModule {}
