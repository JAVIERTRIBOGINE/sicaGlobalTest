import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { BaseCVA } from './baseControlValueAccesor';

@Component({
  selector: 'sica-custom-form-control',
  templateUrl: './custom-form-control.component.html',
})

/**
 * Por herencia recoge la funcionalidad de ControlAccessor - programación reactiva
 */
export abstract class CustomFormControlComponent extends BaseCVA implements OnInit {

  @Input() formControlName?: string;
  @Input() icon?: string;
  @Input() labelText?: string;
  @Input() placeholder?: string;
  @Input() error?: string;  
  @Input() formSubmit = false;
  @Input() disabled = false;
  @Input() customStyles = '';

  public control: FormControl;
  
  protected constructor(protected controlContainer: ControlContainer) {
    super();
  }

  ngOnInit() {
    const form = this.controlContainer.control as FormGroup;
    this.control = form.controls[this.formControlName] as FormControl;
  }

  get isValidField(): boolean {
    return !this.control.pristine && this.control.valid;
  }

  get isWrongField(): boolean {
    return this.formSubmit && this.control.invalid;
  }

  get isIncluded(): boolean {
    return this.control.invalid && this.control.errors.isIncluded;
  }
  get isInvalidFormat(): boolean {
    return this.control.invalid && this.control.errors.formatError;
  }

  get isRequired(): boolean {
    return this.control.invalid && this.control.errors.isRequired;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  abstract get updateStyles()

  get requiredValidator() {
    const validator = this.control.validator ? this.control.validator({} as AbstractControl) : false;
    return (validator && validator.required) ? true : false;
  }
}


