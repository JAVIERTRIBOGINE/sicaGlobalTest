
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { JsonService } from 'src/app/core/services/json.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { changeDateToIso, changeIsoToDate } from 'src/app/core/services/utils.service';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from 'src/app/core/services/language.service';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { RouterService } from 'src/app/core/services/router.servcice';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { AccountService } from 'src/app/core/services/account.service';



@Component({
  selector: 'sica-formsNg',
  templateUrl: './formsNg.component.html',
  styleUrls: ['./formsNg.component.scss'],
  providers: [TranslateService, MessageService]
})
export class FormsNgComponent implements OnInit {

  // Datos de registros de tablas de formularios con multiregistros
  public records: object[] = [];
  //

  // campos de los registros de tablas de formularios con multiregistros
  public recordsColumns: any[] = [];

  formSubmit: boolean;

  // Formgroup que recoge todos los formcontrols del formularo
  globalForm: FormGroup;

  // datos de los campos del formulario en el json
  formAreas: any[] = [];

  // inputs 
  @Input() jsonDataForm;
  @Input() submitAndHome = false;
  @Input() editData: any;
  @Input() modalAction;
  @Input() disabled = false;


  // booleanos que permiten visualizar elementos html cuando los datos estén cargados
  formLoaded: boolean = false;
  tableLoaded: boolean = false;


  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter<any>();
  testValue: string;


  constructor(
    public primengConfig: PrimeNGConfig,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    public jsonService: JsonService,
    private location: Location,
    public apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    public routerService: RouterService,
    public languageService: LanguageService,
    public messageService: MessageService,
    public customMessageService: CustomMessageService,
    public dictionaryService: DictionaryService,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {

    this.loadPageForm();
  }

  /**
   * Se leen los datos de json
   */
  loadPageForm() {
    this.formAreas = this.jsonDataForm.area;
    this.globalForm = this.formBuilder.group({});
    this.formAreas.forEach(element => {
      element['subArea'].forEach(subElement => {
        if (!!subElement.customTraduction && subElement.customTraduction) {
          subElement.data.forEach(data => {
            let nameToTranslate = this.translate.instant(data.nombre);
            data.nombre = nameToTranslate;
          });
        }
        if (!(this.IdInCreateForm(subElement.id)) && !this.isNoFormId(subElement.id)) {
          this.globalForm.addControl(
            subElement.id, // nomnbre el formcontrol
            new FormControl( // valor y propiedad disabled del formcontrol
              this.isEditData ?
                  subElement.tag === "calendar" ? 
                    changeIsoToDate(this.editData.data[subElement.id]) :
                    this.editData.data[subElement.id] : 
                  subElement.tag === "pickList" ? 
                    [] : 
                    '' 
          )
        );
          if (!!subElement.validations) this.defineValidation(subElement);
        }
      });
    });
    this.formLoaded = true;
  }

  // se definen las validaciones a partir de la 
  // ... lectura de json
  defineValidation(element) {
    
    let validations = element.validations;
    let validators: ValidatorFn[] = [];
    for (let validation in validations) {
      switch (validation) {
        case "required":
          validators.push(Validators.required);
          break;
        case "maxLength":
          validators.push(Validators.maxLength(validations[validation]));
          break;
        case "minLength":
          validators.push(Validators.minLength(validations[validation]));
          break;
        case "max":
          validators.push(Validators.max(validations[validation]));
          break;
        case "min":
          validators.push(Validators.min(validations[validation]));
          break;
        default:
          break;
      }
    }
    this.globalForm.controls[element.id].setValidators(validators)
  }

  /**
   * disparando evento 'click' se añade nuevo registro al formulario con multiregistros
   */
  addRow() {
    this.records.push(this.globalForm.value)
  }

  /**
   * con evento submit de momento se refleja en console los datos del form
   */
  onSubmit() {

    this.formSubmit = true;
    this.onCustomSubmit.next(this.globalForm.value);
  }

  // se definen las columnas en caso de multiregistros
  defineFieldColumns(jsonFields) {
    for (let field of jsonFields) {
      this.recordsColumns.push({ field: field['DTO'], header: this.translate.instant(field['LABEL']) });
    }
    this.tableLoaded = true;
  }


  //en caso de multiregistro, en envían los registros añadidos
  updateRowData(event) {
    this.records = event;
  }

  // botón de volver
  back() {
    this.location.back();
  }
  navigateToEdit() {
    this.router.navigate( ['../' + constants.Actions.EDIT], { relativeTo: this.route });
  }

  navigateToDelete() {
    this.router.navigate(['../' + constants.Actions.DELETE], { relativeTo: this.route });
  }

  navigateToHistoric() {
    this.router.navigate( ['../' + constants.Actions.AUDIT], { relativeTo: this.route });
  }


  /**
   * evalua si debe aparecer boton de limpiar todos los campos de filtro
   */
  viewButton(button) {
    return !!this.jsonDataForm.buttons && !!this.jsonDataForm.buttons[button] ? this.jsonDataForm.buttons[button] : false;
  }

  // en caso de multiregistro booleano : en true la tabla de 
  // ... registros está leída
  get loadedTable() {
    return this.tableLoaded;
  }

  // en caso de edición, booelano: en true los datos de la row leídos
  get loadedForm() {
    return this.formLoaded;
  }

  // booleano: en true si es formulario de registro
  get isEditData() {
    return this.editData !== null && this.editData !== undefined;
  }

  // booleano: en true si el formulario es válido
  get validForm() {
    return this.globalForm.valid;
  }

  get isFilled() {
    return this.dictionaryService.isFilled();
  }

  public IdInCreateForm(idElement) {
    return this.routerService.getAction() === constants.Actions.CREATE && idElement === "id";
  }

  isCustomTemplate(custom) {
    return !!custom && custom;
  }


  isNoFormId(id) {
    return id ==="no-form-control";
  }

  getAsociar() {
    if (this.editData.data.asociada)
      return 'GENERAL.ALERTS.BUTTON_DESASOCIAR';

    return 'GENERAL.ALERTS.BUTTON_ASOCIAR';
  }

  getSubmit(): string {
    switch (this.routerService.getAction()) {
      case constants.Actions.DELETE:
        return 'GENERAL.ALERTS.BUTTON_DELETE';
      case constants.Actions.CREATE:
        return 'GENERAL.ALERTS.BUTTON_SAVE_POST';
      case constants.Actions.EDIT:
        return 'GENERAL.ALERTS.BUTTON_SAVE_EDIT';
      default:
        return 'GENERAL.ALERTS.BUTTON_SAVE';
    }
  }

  emitAction(value, flag){
    switch (flag) {
      case "routings-concession-toZone-toRol":
        this.router.navigate(["../" + value ], { relativeTo: this.route });    
        break;
      case "customTest":
        this.testValue = value;
        break;
    
      default:
        break;
    }
    debugger;
  }
}
