import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LanguageService } from 'src/app/core/services/language.service';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'sica-selectNg',
  templateUrl: './selectNg.component.html',
  styleUrls: ['./selectNg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => selectNgComponent),
      multi: true
    }
  ]
})
export class selectNgComponent extends CustomFormControlComponent {
  @Input()data = [];
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() changeLan;
  @Input() disabled;
  @Input() readOnly;

  constructor(
    controlContainer: ControlContainer,
    private languageService: LanguageService
    ) {
    super(controlContainer);
  }
    /**
   * metodo llamado por template (ngModelChange)
   */

  updateValue() {    
    // se llama al método registrado para comportamiento del this.value de manera reactiva
    if (this.changeLan) this.languageService.setLanguage(this.value);
    this.onChange(this.value);
    this.filterChange.emit(true);
    
  }

  // necesario para 'llenar' el valor inicialmente (en edit)
  writeValue(val: string) {
    this.value = val;
  }

  
  get dirtyAndRequired() {
    return this.control.errors?this.control.dirty && this.control.errors.required:false;
  }


  get updateStyles() {
    return null;
  }
}
