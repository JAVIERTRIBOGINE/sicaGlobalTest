import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';



@Component({
  selector: 'sica-checkboxNg',
  templateUrl: './checkboxNg.component.html',
  styleUrls: ['./checkboxNg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxNgComponent),
      multi: true
    }
  ]
})
export class CheckboxNgComponent extends CustomFormControlComponent {
  checked: boolean = false;
  @Input() type;
  @Input() showInfo = false;
  @Input() readOnly = false;
  @Input() labelText;
  focused = false;
  @Output() keyPressAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() iconAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  updateValue() {
    this.onChange(this.value);
    this.filterChange.emit(true);
  }

  writeValue(val: string) {
    this.value = val;
  }

  changeFocus() {
    this.focused = !this.focused;
  }

  get updateStyles() {
    return [this.focused && !this.readOnly ? 'focused' : '', this.disabled ? 'disabled' : '', ...this.customStyles.split(' ')];
  }
}
