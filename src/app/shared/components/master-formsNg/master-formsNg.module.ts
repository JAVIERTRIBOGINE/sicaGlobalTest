import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


// traducciones
import { TranslateModule } from '@ngx-translate/core';
// MÓDULOS DE LA LIBRERÍA DE PRIMENG
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DropdownModule} from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {MultiSelectModule} from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { FileUploadModule } from 'primeng/fileupload';
import { PickListModule } from 'primeng/picklist';
import { SliderModule } from 'primeng/slider';



// LIBRERÍA PARA FORMULARIOS
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

// MÓDULOS Y COMPONENTES COMUNES PARA GENERAR FORMULARIOS DINÁMICAMENTE
import { MasterFormsNgComponent } from './master-formsNg.component';

@NgModule({
  imports: [FormsModule, SliderModule, ReactiveFormsModule, CommonModule, InputTextModule, ButtonModule, FileUploadModule,
    CheckboxModule, RadioButtonModule, DropdownModule, InputTextareaModule, MultiSelectModule,
    CalendarModule, TriStateCheckboxModule, PickListModule, TranslateModule.forChild()], 
  declarations: [ MasterFormsNgComponent ],
  exports: [FormsModule, ReactiveFormsModule, TranslateModule, MasterFormsNgComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [FormControl]
})
export class MasterFormsNgModule {}
