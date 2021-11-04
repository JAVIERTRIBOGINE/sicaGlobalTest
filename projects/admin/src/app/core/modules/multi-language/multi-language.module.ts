import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilanguageComponent } from './multi-language.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SearchFormsNgModule } from 'src/app/shared/components/search-formsNg/search-formsNg.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const route: Routes = [
  { 
    path: '', component: MultilanguageComponent
 }
]

@NgModule({
  imports: [SearchFormsNgModule, ToastModule, ButtonModule, CommonModule, SharedModule, CardModule, RouterModule.forChild(
  route
  ),  TranslateModule.forChild()],
  declarations: [ MultilanguageComponent],
  exports: [],
})
export class MultiLanguageModule {}
