import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonService } from 'src/app/core/services/json.service';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/core/services/language.service';
import { DataTransfer } from 'src/app/core/models/other-interfaces'
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { delay } from 'src/app/core/services/utils.service';

function delay2(callback, ms) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

@Component({
  selector: 'sica-search-formsNg',
  templateUrl: './search-formsNg.component.html',
  styleUrls: ['./search-formsNg.component.scss'],
  providers: [TranslateService, DynamicDialogRef, DynamicDialogConfig]
})


export class SearchFormsNgComponent implements OnInit, OnChanges {

  @Input() loadFromUrl: boolean = true;
  formSubmit: boolean;

  // Formgroup que recoge todos los formcontrols del formularo
  searchGlobalForm: FormGroup;

  // datos recogidos del json que define los formularios
  public formProperties: INTERFACES.jsonViewData;

  // datos de los campos del formulario en el json
  formAreas: INTERFACES.searchAreas[] = [];

  @Input() jsonDataForm;
  @Input() conciliation;

  @Output() notFilterData: EventEmitter<any> = new EventEmitter<any>(); 
  @Output() submitUploadOption: EventEmitter<string> = new EventEmitter<string>();

  // booleanos que permiten visualizar elementos html cuando los datos estén cargados
  formLoaded: boolean = false;
  tableLoaded: boolean = false;
  staticConcession: any;
  concessionSlug: any;
  entityConcessionSlug: any;
  constantEntitieConfig: any;
  idRow: any;
  action: any;
  pageConfig: any = {};
  multissubscription: Subscription = new Subscription();
  cachedFiltersLabel: string;

  constructor(
    public primengConfig: PrimeNGConfig,
    private formBuilder: FormBuilder,
    public dictionaryService: DictionaryService,
    public apiService: ApiService,
    public router: Router,
    public languageService: LanguageService,
    public dataTransferService: DataTransferService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.jsonDataForm && !changes.jsonDataForm.firstChange) {
      if (this.loadFromUrl) this.getValuesFromUrl();
      this.loadForm();
    }
  }

  ngOnInit(): void {

    // se cogen los valores de url
    if (this.loadFromUrl) this.getValuesFromUrl();
    else this.cachedFiltersLabel = this.conciliation + '-filter';

    this.searchGlobalForm = this.formBuilder.group({});

    // se carga el formulario
    this.loadForm();
  }

  /**
   * se cogen los valores de url. Se necesitan para comprobar si hay 
   * datos de filtros en caché
   */
  getValuesFromUrl() {
    let validUrl = this.router.url.split('/');
    validUrl.splice(0, 1);
    [this.staticConcession, this.concessionSlug, this.entityConcessionSlug, this.idRow, this.action] = validUrl;
    this.constantEntitieConfig = constants.ENTITY_REFERENCES[this.entityConcessionSlug.toUpperCase()];
    this.cachedFiltersLabel = this.concessionSlug + "-" + this.entityConcessionSlug + "-" + constants.Actions.FILTER;
  }

  // si hay filtros guardados en caché, se recuperan y se aplican
  cachedFilteredData(label) {
    return this.dataTransferService.getDataTransferinSessionStorage(label) !== null;
  }



  /**
   * Se leen los datos de json para conformar el formulario
   */
  loadForm() {
    // se asignan en variables el json
    this.formProperties = this.jsonDataForm;
    this.formAreas = this.formProperties.area;

    // se itera la parte del json que formará los campos del formulario
    this.formAreas.forEach(element => {
      // si es un select cambia el id por el label traducido del catálogo 
      if ((element['tag'] === "select" || element['tag'] === "multi-select") && !!element['catalog']) {
        const catalog = element['catalog'];
        if (!!catalog) {
          this.dictionaryService.getDataDictionaries(catalog, this.languageService.getLanguage()).subscribe(catalogData => {
            element['data'] = catalogData;
          });
        }
      }
      // añade el formcontrol a partir del elemento iterado
      this.searchGlobalForm.addControl(element.id, new FormControl(''));
    });

    // se revisa si hay valores a filtrar guardados en caché
    this.cachedfilters();
    this.formLoaded = true;
  }

  /**
   * aplica filtro al cambiar de valor. Viene de la template
   */
  filterOnChange(asyncFilter) {
    if (!asyncFilter) {
      setTimeout((e) => this.sessionAndFilter(), 1000);
    }
  }



  sessionAndFilter() {
      this.dataTransferService.setDataTransferinSessionStorage(this.cachedFiltersLabel, this.searchGlobalForm.value);
      if (!!this.conciliation) this.specialFilterConciliatioin();
      else this.dataTransferService.setFilterTransfer(this.convertDataToInterface(this.searchGlobalForm.value));
  }

  upload(){
    this.notFilterData.next(this.searchGlobalForm.value);
  }

  syncFilterOnChange() {

    this.dataTransferService.setDataTransferinSessionStorage(this.cachedFiltersLabel, this.searchGlobalForm.value)
    this.dataTransferService.setFilterTransfer(this.convertDataToInterface(this.searchGlobalForm.value));
  }

  specialFilterConciliatioin() {
    switch (this.cachedFiltersLabel) {
      case constants.SESSION_STORAGE_LABELS.COLLECTIONS:

        this.dataTransferService.setFilterCollectionTransfer(this.convertDataToInterface(this.searchGlobalForm.value));
        break;

      case constants.SESSION_STORAGE_LABELS.PAYMENTS:
        this.dataTransferService.setFilterPaymentTransfer(this.convertDataToInterface(this.searchGlobalForm.value));
        break;
      default:
        break;
    }
  }

  /**
   * si hay datos de filtros para esta pantalla, los
   * ... recogerá y aplicará el filtro
   */
  cachedfilters() {
    // si en caché hay valores
    if (this.cachedFilteredData(this.cachedFiltersLabel)) {
      //... mételos en el formulario
      this.searchGlobalForm.setValue(
        this.dataTransferService.getDataTransferinSessionStorage(this.cachedFiltersLabel
        ));
      // ...convierte esos valores en objeto que filtrará
      let convertedFormValues = this.convertDataToInterface(this.searchGlobalForm.value);

      // ... y envía esos valores para que filtren desde el inicio
      if (this.conciliation) this.specialFilterConciliatioin();
      else this.dataTransferService.setFilterTransfer(convertedFormValues);

    }
  }



  /**
   * Convierte datos en objeto a filtrar
   * @param data datos a convertir
   * @returns 
   */
  convertDataToInterface(data): DataTransfer[] {
    let dataTransf: DataTransfer[] = [];
    for (let row in data) {
      dataTransf.push({ key: row, value: data[row] });
    }
    return dataTransf;
  }


  /**
   * getter que actua de booleanos para visualiar porciones de html una vez los datos estén cargados
   * */
  get loadedForm() {
    return this.formLoaded;
  }

  /**
   * getter que actua de booleanos para visualiar porciones de html una vez los datos estén cargados
   * */
  get loadedTable() {
    return this.tableLoaded;
  }

  /**
   * evalua si debe aparecer boton de limpiar todos los campos de filtro
   */
  viewButton(button) {
    return !!this.formProperties.filterButtons && !!this.formProperties.filterButtons[button] ? this.formProperties.filterButtons[button] : false;
  }


  clean() {
    for (let formValue in this.searchGlobalForm.controls) {
      this.searchGlobalForm.controls[formValue].setValue("");
    }

    // ... pasa los valores limpios a la caché
    this.dataTransferService.setDataTransferinSessionStorage(this.cachedFiltersLabel, this.searchGlobalForm.value)

    // ...convierte esos valores en objeto que filtrará
    let convertedFormValues = this.convertDataToInterface(this.searchGlobalForm.value);

    // ... y envía esos valores para que filtren desde el inicio

    if (!!this.conciliation) this.specialFilterConciliatioin()
    else this.dataTransferService.setFilterTransfer(convertedFormValues);
  }

  /**
   * con evento submit de momento se refleja en console los datos del form
   */
  onValidate() {
    this.formSubmit = true;
  }

  onExcelOption(event) {
    this.submitUploadOption.next(event)
  }

  get syncFilter() {
    return !!this.formProperties.filterButtons && !!this.formProperties.filterButtons.submitButton && this.formProperties.filterButtons.submitButton;
  }

}
