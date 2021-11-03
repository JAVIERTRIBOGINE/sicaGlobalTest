import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


// traducciones
import { TranslateModule } from '@ngx-translate/core';
// MÓDULOS DE LA LIBRERÍA DE PRIMENG
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputSwitchModule} from 'primeng/inputswitch';
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
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';
import { FormsNgComponent } from './formsNg.component';
import { InputNgComponent } from '../inputNg/inputNg.component';
import { multiSelectNgComponent } from '../multi-selectNg/multi-selectNg.component';
import { CheckboxNgComponent } from '../checkboxNg/checkboxNg.component';
import { SwitchNgComponent } from '../switchNg/switchNg.component';
import { SliderNgComponent } from '../sliderNg/sliderNg.component';
import { TriCheckboxNgComponent } from '../triCheckboxNg/triCheckboxNg.component';
import { CalendarNgComponent } from '../calendarNg/calendarNg.component';
import { selectNgComponent } from '../selectNg/selectNg.component';
import { UploadNgComponent } from '../uploadNg/uploadNg.component';
import { PickListNgComponent } from '../pickListNg/pickListNg.component';
import { CustomComponentComponent } from 'src/app/shared/components/custom-component/custom-component.component';

export const CUSTOM_FORM = [
  CustomFormControlComponent
];

@NgModule({
  imports: [FormsModule, SliderModule, ReactiveFormsModule, CommonModule, InputTextModule, ButtonModule, FileUploadModule,
    CheckboxModule, InputSwitchModule, RadioButtonModule, DropdownModule, InputTextareaModule, MultiSelectModule,
    CalendarModule, TriStateCheckboxModule, PickListModule, TranslateModule.forChild()], 
  declarations: [CUSTOM_FORM, FormsNgComponent, SliderNgComponent, InputNgComponent, UploadNgComponent, PickListNgComponent,
    CheckboxNgComponent, SwitchNgComponent, selectNgComponent, multiSelectNgComponent,
    TriCheckboxNgComponent, CalendarNgComponent, CustomComponentComponent
  ],
  exports: [FormsModule, ReactiveFormsModule, TranslateModule, FormsNgComponent, CUSTOM_FORM, FormsNgComponent, 
    InputNgComponent, CheckboxNgComponent, SwitchNgComponent, selectNgComponent, multiSelectNgComponent, FileUploadModule, UploadNgComponent, 
    PickListNgComponent, TriCheckboxNgComponent, CalendarNgComponent, SliderNgComponent, CustomComponentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [FormControl]
})
export class FormsNgModule {}
