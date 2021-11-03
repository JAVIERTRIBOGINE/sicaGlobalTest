import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeModule } from './home/home.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, HttpClientModule, HomeModule, SharedModule,
    TranslateModule.forChild(), HeaderModule
],
  exports: [TranslateModule]
})
export class DashboardModule {}
