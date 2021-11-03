import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';

@Component({
  selector: 'sica-inputNg',
  templateUrl: './inputNg.component.html',
  styleUrls: ['./inputNg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNgComponent),
      multi: true
    }
  ]
})

/**
 * por herencia es capaz de crear un controlContainer.
 */
export class InputNgComponent extends CustomFormControlComponent {
  @Input() type = 'text';
  @Input() min = false;
  @Input() max = false;
  @Input() maxLength;
  @Input() showInfo = false;
  @Input() readOnly = false;
  @Input() labelText;
  @Input() validations;
  @Input() placeholder;
  focused = false;
  @Output() keyPressAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() iconAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  /**
   * metodo llamado por template (ngModelChange)
   */
  updateValue() {
    // se llama al método registrado para comportamiento del this.value de manera reactiva
    this.onChange(this.value.trim());
    this.filterChange.emit(true);
  }


  // necesario para 'llenar' el valor inicialmente (en edit)
  writeValue(val: string) {
    this.value = val;
  }

  keyPress(event) {
    this.keyPressAction.emit(event.target.value);
  }

  changeFocus() {
    this.focused = !this.focused;
  }

  iconClick() {
    this.iconAction.emit();
  }

  clearfilter(){
    this.value="";
    this.onChange(this.value.trim())
    this.filterChange.emit(true)
  }

  /**si el valor no está vacío el aspa de limpiar aparece, si no, no aparece. */
  valueNotEmpty(){
    if (this.disabled) return !this.disabled;
    else if (typeof(this.value)==='number') return this.value !== 0;
    else if (typeof(this.value) === 'string') return this.value !== "";
    else if (typeof(this.value) === 'boolean') return this.value;
    else return false;
  }

  get updateStyles() {
    return [this.focused && !this.readOnly ? 'focused' : '', this.disabled ? 'disabled' : '', ...this.customStyles.split(' ')];
  }

  get dirtyAndRequired() {
    return this.control.errors?this.control.dirty && this.control.errors.required:false;
  }

  get dirtyAndMax() {
    return this.control.dirty && this.control.errors.max
  }

  get borderColor() {
    return this.control.dirty && this.control.valid? '1px solid var(--border-dark)':
     this.control.dirty && this.control.invalid? '2px solid var(--red)': '1px solid var(--border-primary)'
  }

}
