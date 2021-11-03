import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from './primeNg.module';
import { ComponentsModule } from './components/components.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SearchFormsNgModule } from './components/search-formsNg/search-formsNg.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsNgModule } from './components/formsNg/formsNg.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [],
  imports: [
    NgxUiLoaderModule,
    PrimeNgModule,
    ComponentsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    SearchFormsNgModule,
    FormsNgModule,
    TranslateModule.forChild()
  ],
  exports: [ ComponentsModule, PrimeNgModule, TranslateModule, NgxUiLoaderModule],
})
export class SharedModule {}
