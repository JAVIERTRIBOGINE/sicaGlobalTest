import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';


@Component({
  selector: 'sica-multi-selectNg',
  templateUrl: './multi-selectNg.component.html',
  styleUrls: ['./multi-selectNg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => multiSelectNgComponent),
      multi: true
    }
  ]
})
export class multiSelectNgComponent  extends CustomFormControlComponent{

  valorTest: number[]=[];
  @Input() data = [];
  @Input() styleClass;
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  /**
   * metodo llamado por template (ngModelChange)
   */
  updateValue() {
    // se llama al método registrado para comportamiento del this.value de manera reactiva

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
