import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomFormControlComponent } from '../custom-form-control/custom-form-control.component';
import * as constants from 'src/app/core/config/const'



@Component({
  selector: 'sica-pickListNg',
  templateUrl: './pickListNg.component.html',
  styleUrls: ['./pickListNg.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PickListNgComponent),
      multi: true
    }
  ]
})
export class PickListNgComponent extends CustomFormControlComponent implements OnInit {
  fileDemo: any;

  checked: boolean = false;
  @Input() type;
  @Input() showInfo = false;
  @Input() readOnly = false;
  @Input() labelText;
  focused = false;
  @Output() keyPressAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() iconAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  blob: any;
  @Input() sourceEndpoint;
  @Input() storage;
  @Input() target;
  source: any[] = [];

  constructor(
    controlContainer: ControlContainer,
    private apiService: ApiService,
    private ngxUiLoaderService: NgxUiLoaderService
  ) {
    super(controlContainer);

  }

  ngOnInit() {
    
    if (!!this.storage) {
      let source = JSON.parse(sessionStorage.getItem(this.storage));
      this.filterSource(source);

    } else {

      this.ngxUiLoaderService.startLoader("pickListLoader");
      this.apiService.getDataById(this.sourceEndpoint).subscribe(
        response => {
          this.source = response.data.filter(d => this.target.filter(t => t.id == d.id).length === 0)
        },
        error => console.error("error: ", error),
        () => this.ngxUiLoaderService.stopLoader("pickListLoader")
      );
    }


  }

  filterSource(source) {
    source.forEach((element, index) => {
      if (!this.target.find(targetItem => targetItem.nombre === element.nombre)) {
        this.source.push(element)
      }
    });
  }



  updateValue() {
    // se llama al método registrado para comportamiento del this.value de manera reactiva
    this.onChange(this.value);

    this.filterChange.emit(true);
  }

  // necesario para 'llenar' el valor inicialmente (en edit)
  writeValue(val: string) {

    this.value = val;
  }

  keyPress(event: KeyboardEvent) {
  }


  get dirtyAndRequired() {
    return this.control.errors ? this.control.dirty && this.control.errors.required : false;
  }


  get updateStyles() {
    return null;
  }

  get targetSourceAndEnpoint() {
    return !!this.target /*&& !!this.sourceEndpoint*/ && !!this.source
  }

}
