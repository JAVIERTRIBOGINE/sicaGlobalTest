import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// LIBRERÍA PARA FORMULARIOS
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

// MÓDULOS Y COMPONENTES COMUNES PARA GENERAR FORMULARIOS DINÁMICAMENTE
import { SearchFormsNgComponent } from './search-formsNg.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsNgModule } from 'src/app/shared/components/formsNg/formsNg.module'

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FormsNgModule, TranslateModule.forChild()],
  declarations: [SearchFormsNgComponent],
  exports: [FormsModule, ReactiveFormsModule, TranslateModule,SearchFormsNgComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [FormControl]
})
export class SearchFormsNgModule {}
