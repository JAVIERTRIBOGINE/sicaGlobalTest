import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { timingSafeEqual } from 'crypto';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';



@Component({
  selector: 'sica-uploadNg',
  templateUrl: './uploadNg.component.html',
  styleUrls: ['./uploadNg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadNgComponent),
      multi: true
    }
  ]
})
export class UploadNgComponent extends CustomFormControlComponent {
  fileDemo: any;

  checked: boolean = false;
  @Input() type;
  @Input() showInfo = false;
  @Input() readOnly = false;
  @Input() labelText;
  @Input() standard = false;

  focused = false;
  @Output() keyPressAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() iconAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() excelOption: EventEmitter<string> = new EventEmitter<string>();
  stringFile: any;

  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  myExcelModulesUploader(event, object) {
    object.clear();
    this.excelOption.next(event.files);
  }
  
  async myUploader(event) {
    
    this.fileDemo = event.files[0].objectURL;
    var reader = new FileReader();
    reader.readAsDataURL(event.files[0]);

    reader.onload = (event) => {
      this.value = event.target.result.toString();
      this.updateValue();
    }

  }

  updateValue() {
    // se llama al método registrado para comportamiento del this.value de manera reactiva
    this.onChange(this.value.trim());
    this.filterChange.emit(true);
  }


  // necesario para 'llenar' el valor inicialmente (en edit)
  writeValue(val: string) {
    this.value = val;
  }


  
  removeFile(event) {
    this.value = "";
    this.fileDemo = null;
    this.stringFile = null;

  }

  get isStandard(){
    return !!this.standard && this.standard;
  }

  get updateStyles() {
    return [this.focused && !this.readOnly ? 'focused' : '', this.disabled ? 'disabled' : '', ...this.customStyles.split(' ')];
  }
}
