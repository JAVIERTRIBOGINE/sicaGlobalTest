import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../shared/header/header.module';
import { ConcessionComponent } from './concession.component';
import { ConcessionHomeRoutingModule } from './concession-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {TranslateModule} from '@ngx-translate/core';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [ConcessionComponent],
  imports: [CommonModule, HttpClientModule, ConcessionHomeRoutingModule, SharedModule,CardModule, TranslateModule.forChild(), HeaderModule],
  exports: [TranslateModule],
})
export class ConcesssionHomeModule {}
