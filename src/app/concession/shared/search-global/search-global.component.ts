import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as constants from 'src/app/core/config/const';
import * as ENTITIES from 'src/app/core/models/entities';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { JsonService } from 'src/app/core/services/json.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';
import { Observable, Subscription } from 'rxjs';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { ApiService } from 'src/app/core/services/api.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { DataTransfer, CatalogData } from 'src/app/core/models/other-interfaces';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AccountService } from 'src/app/core/services/account.service';
import { SearchFormsNgComponent } from 'src/app/shared/components/search-formsNg/search-formsNg.component';
import { exportExcel, exportPdf } from 'src/app/core/services/utils.service';
import { RouterService } from 'src/app/core/services/router.servcice';
import { NavigationEnd } from '@angular/router';


@Component({
  selector: 'sica-search-global',
  templateUrl: './search-global.component.html',
  styleUrls: ['./search-global.component.scss'],
  providers: [DialogService, MessageService, DynamicDialogRef, TranslateService]
})
export class SearchGlobalComponent implements OnInit, OnDestroy {
  /**
   * SUSCRIPCIONES. Se cierran en el OnDestroy
   * */
  subsLan$: Subscription = new Subscription();
  subsTranslate$: Subscription = new Subscription();
  subsJson$: Subscription = new Subscription();
  subsRead$: Subscription = new Subscription();
  subsModal$: Subscription = new Subscription();
  subsRouter$: Subscription = new Subscription();

  //----

  subsTransfer$: Subscription = new Subscription();
  dataTransfer$: Observable<DataTransfer[]>;

  language$: Observable<string>;

  // datos de JSON de Search Table
  jsonData: INTERFACES.jsonViewData;

  // datos que se pasan a la Search Table
  data: ENTITIES.Reading[] = [];

  // campos de columna que se pasan a la Search Table
  columns: INTERFACES.column[] = [];

  // campo que alberga registros múltiples
  dto_multipleRecords: string = "";

  searchAreas: INTERFACES.searchAreas[];

  //valores recogidos de la url
  staticConcession: string = "";

  //comunicaremos con el tableComponent para pasarle valores de filtros
  @ViewChild("tableCpt", { static: false }) tableCpt: TableComponent;
  @ViewChild("searchModule", { static: false }) searchCpt: SearchFormsNgComponent;
  //objeto de datos que van a filtrar a la tabla y que vienen del módulo de searchForm
  filteredData: DataTransfer[];

  //array de objetos que definen las columnas de la tabla
  dataFields: INTERFACES.dataFields[];

  //array de objetos con los datos de los catálogos
  catalogsData: CatalogData[][] = [];

  //boleanao: true si los catálogos estan cargados
  loadedCatalogData: boolean = true;

  //valor del id de la concesión extraído de los permisos guardados en sessionstorage
  idConcession: string;

  //booleano extraído de json que permitirá o no visualizar los filtros de prime en la tabla
  internalFilter: boolean;

  //booleano extraído de json que permitirá o no visualizar los ordenamientos de prime en la tabla
  internalSort: boolean;

  // array de strings que selecciona las propiedades del objeto que se va a recibir
  viewDataFields: string[] = []

  activeState: boolean[] = [true];
  dataChip: string[] = [];
  apiParams: any;
  loader: string = "loaderSearch";

  defaultPageSize: number[] = constants.tablePageSize;
  defaultPageNumber: number = constants.tablePageNumber;
  totalRecords: number;
  rows: number;
  pageNumber: number;
  pageSize: number[];
  
  //parte de la url específica de llamada a la api
  entityEndpoint: string = "";
  filterParam: any;
  generalTitle: string = "";
  tableButtons: INTERFACES.buttons;
  entity: string;
  masterEntity: string;
  isModal: boolean;

  constructor(
    public dialogService: DialogService,
    public jsonService: JsonService,
    public messageService: MessageService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private dictionaryService: DictionaryService,
    private router: Router,
    private route: ActivatedRoute,
    public routerService: RouterService,
    private apiService: ApiService,
    public dataTransferService: DataTransferService,
    public customMessageService: CustomMessageService,
    public ngxUiLoaderService: NgxUiLoaderService,
    public accountService: AccountService
  ) {
    this.dataTransfer$ = this.dataTransferService.matchFilterTransfer();
    this.subsTransfer$ = this.dataTransfer$.subscribe((data: DataTransfer[]) => {
      this.dataChip = [];
      this.filterParam = [];
      data.forEach(rowData => {
        if (rowData.value != null && ((typeof (rowData.value) === "string" && rowData.value !== "") || (typeof (rowData.value) !== "string" && rowData.value?.length !== 0))) {
          this.filterParam[rowData.key] = rowData.value;
          this.dataChip.push(rowData.key + " : " + rowData.value)
        }
      });
      this.getApiParams();

      this.getDataFromApi(this.apiParams);
    });
    this.language$ = this.languageService.watchLanguage();
    this.routerService.conformNewSearchModulesData(this.router);
    this.updatingtranslations();
    this.subsRouter$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.data = [];
        this.routerService.conformNewSearchModulesData(this.router);
        this.updatingtranslations();
        this.init();
      }

    });
  }

  ngOnInit(): void {
    this.init();
  }

  public init() {

    //se recoge el valor de la concesión
    this.idConcession = this.routerService.getIdConcession();
    this.getDataFromRoutinService();
    //Subscripción de lectura de json para la Search Table
    this.subsJson$ = this.jsonService.readAllFile(this.routerService.getJsonSearchFileName()).subscribe(result => {
      this.jsonData = result;
      this.tableButtons = !!this.jsonData.table.tableButtons ? this.jsonData.table.tableButtons : null;
      this.generalTitle = this.jsonData.title;
      this.masterEntity = this.routerService.isMasterModule? constants.mastersTraduction[this.routerService.urlParams['admin-subentity']]:"";
      this.isModal = !!this.jsonData.table?.isModal?this.jsonData.table.isModal:false;
      this.pageSize = this.thereIsPageSize ? this.jsonData.table.pageSize : this.defaultPageSize
      this.rows = this.thereIsPageSize ? this.jsonData.table.pageSize[0] : this.defaultPageSize[0];
      this.pageNumber = this.thereIsPageNumber ? this.jsonData.table.pageSize[0] : this.defaultPageNumber
      // se cargan catalogos en la tabla y en el formulario de filtros, si hay
      if (!!this.jsonData.area) {
        this.searchAreas = this.jsonData.area;
        this.dictionaryService.catalogsForSearch(this.searchAreas);
      }
      this.dataFields = this.jsonData.table.dataFields;
      this.dictionaryService.catalogsForTable(this.dataFields)
      this.viewDataFields = this.dataFields.map(function (field) { return field.DTO })
      this.internalFilter = !!this.jsonData.table.ownTableFilter ? this.jsonData.table.ownTableFilter : false;
      this.internalSort = !!this.jsonData.table.ownTableSort ? this.jsonData.table.ownTableSort : false;
      this.readData();
    });
  }

  public readData() {
    this.columns = [];

    this.entityEndpoint = this.routerService.getPossibleEndpoints()['GET'];

    this.ngxUiLoaderService.startLoader("loaderSearch");
    this.getApiParams()
    this.getDataFromApi(this.apiParams);
  }

  getDataFromApi(params) {
    this.subsRead$ = this.apiService.getData(this.entityEndpoint, params).subscribe(
      result => {
        this.totalRecords = result.recordsFiltered;
        this.data = result.data;
        this.defineFieldColumns(this.dataFields);
      },
      (error) => {
        console.warn('error', error);
      },
      () => {
        this.ngxUiLoaderService.stopLoader("loaderSearch");
        this.tableCpt.loading = false;
        if (!!this.customMessageService.getToastMessage()) {
          this.messageService.add(
            this.customMessageService.getToastMessage()
          );
          this.customMessageService.clearToastMessage();

        }
      }
    );
  }



  public getApiParams() {
  
    if (this.routerService.isMasterModule) {
      this.apiParams = {
        Maestro: this.routerService.urlParams['admin-subentity'],
        LanguageIsoCode: this.languageService.getLanguage(),
        ...this.filterParam
      };
    }else {
      this.apiParams = {
        pageNumber: !!this.jsonData.table.pageNumber ? this.jsonData.table.pageNumber : 1,
        pageSize: this.jsonData.table.pageSize.length !== 0 ? this.jsonData.table.pageSize[0] : constants.tablePageSize[0],
        fields: this.configureFields,
        orderBy: constants.tableDefaultSort,
        ...this.filterParam
      };
    }
  }

  updateLazyData(event) {
    if (!!this.tableCpt) {
      this.tableCpt.loading = true;
      this.apiParams.pageNumber = (Math.floor(event.first / event.rows)) + 1;
      this.apiParams.pageSize = event.rows;
      if (!!event.sortField) this.apiParams.orderBy = event.sortOrder === 1 ? event.sortField : event.sortField + " descending"; else delete this.apiParams.orderBy;
      this.getDataFromApi(this.apiParams);
    }
  }

  removeChipFilter(event) {
    let [controlKey, controlValue] = event.value.split(":")
    controlKey = controlKey.trim();
    controlValue = controlValue.trim();
    this.searchCpt.searchGlobalForm.controls[controlKey].setValue("");

    // ... pasa los valores limpios a la caché
    this.dataTransferService.setDataTransferinSessionStorage(this.searchCpt.cachedFiltersLabel, this.searchCpt.searchGlobalForm.value);

    let convertedFormValues = this.searchCpt.convertDataToInterface(this.searchCpt.searchGlobalForm.value);

    // ... y envía esos valores para que filtren desde el inicio
    this.searchCpt.dataTransferService.setFilterTransfer(convertedFormValues);

  }

  closeModal(event) {
    this.getDataFromApi(this.apiParams);
  }

  /**
   * Con los datos recogidos de back, se identifican y recogen los campos de
   * la tabla
   * @param jsonFields 
   */
  defineFieldColumns(jsonFields) {
    this.columns = [];
    for (let field of jsonFields) {
      this.columns.push({ field: field['DTO'], header: this.translate.instant(field['LABEL']), filter: this.internalFilter ? 'true' : 'false', sortable: this.internalSort ? 'true' : 'false', tag: field['TAG'] });
    }
  }

  /**
   * Se llama con el evento 'click' del boton de nuevo registro.
   * Enruta el módulo edit-global
   */
  newRow() {
    this.router.navigate(["./"+ constants.Actions.CREATE] , {relativeTo: this.route});
  }

  /**
   * Cambios de traducciones ante posibles cambios de lenguage
   */
  updatingtranslations() {
    this.subsLan$ = this.language$.subscribe(value => {
      this.subsTranslate$ =
        this.translate.use(value).subscribe(translation => {
          this.defineFieldColumns(this.jsonData.table.dataFields);
        });
    });
  }


  /**
   * colapsa/descolapsa los fomrmularios de filtro. Se llama desde el index
   * @param index índice del bloque sobre el que actuar (solo hay uno, el del formulario) 
   */
  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  outputExportData(event) {
    this.ngxUiLoaderService.startLoader("loaderSearch");
    var name = this.routerService.getCodeConcession() +  "_" + this.routerService.getConcessionEntity();
    this.subsRead$ = this.apiService.getData(this.entityEndpoint, this.apiService.conformExportDataParams(this.apiParams)).subscribe(
      result => {
        switch (event) {
          case "xlsx":
            exportExcel(result.data, name);
            break;
          case "pdf":
            exportPdf(result.data, this.columns, name);

            break;
        }
      },
      (error) => {
        console.warn('error', error);
      },
      () => {
        this.ngxUiLoaderService.stopLoader("loaderSearch");
      }
    );

  }

  asociateCall(event) {
    let endpoints = this.routerService.getPossibleEndpoints();
    let associateEndpoint = endpoints['ASSOCIATE'].replace(":idConcession", this.idConcession);
    let finalValues = {
      zonas: event
    }
    this.apiService.postData(associateEndpoint, finalValues).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "INSERT", "SUCCESS");
      this.tableCpt.selectedRow = [];

      this.init();
    },
      (error) => {
        // se conforma el mensaje toast error en un servicio especial 
        this.customMessageService.buildToastMessage(error, "EDIT", "ERROR");
        console.warn("error", error.message);
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
        this.customMessageService.clearToastMessage();
      }
    );
  }

  disAsociateCall(event) {
    let disAssociateEndpoint = this.routerService.getPossibleEndpoints()['DISASSOCIATE'].replace(":idConcession", this.idConcession)
    let finalValues = {
      zonas: event
    }
    this.apiService.postData(disAssociateEndpoint, finalValues).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "INSERT", "SUCCESS");
      this.tableCpt.selectedRow = [];

      this.init();

    },
      (error) => {
        // se conforma el mensaje toast error en un servicio especial 
        this.customMessageService.buildToastMessage(error, "EDIT", "ERROR");
        console.warn("error", error.message);
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
        this.customMessageService.clearToastMessage();
      }
    );
  }

  activateCall(event) {
    let activateEndpoint = this.routerService.getPossibleEndpoints()['ACTIVATE'];
    this.ngxUiLoaderService.start()
    this.apiService.postData(activateEndpoint, event).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "INSERT", "SUCCESS");
      this.tableCpt.selectedRow = [];

      this.init();
    },
      (error) => {
        // se conforma el mensaje toast error en un servicio especial 
        this.customMessageService.buildToastMessage(error, "EDIT", "ERROR");
        console.warn("error", error.message);
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
        this.customMessageService.clearToastMessage();
      },
      () => this.ngxUiLoaderService.stop()
    );
  }

  disactivateCall(event) {
    debugger;
    let disactivateEndpoint = this.routerService.getPossibleEndpoints()['DISACTIVATE'];
    this.ngxUiLoaderService.start();
    this.apiService.deleteData(disactivateEndpoint, event).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "INSERT", "SUCCESS");
      this.tableCpt.selectedRow = [];

      this.init();

    },
      (error) => {
        // se conforma el mensaje toast error en un servicio especial 
        this.customMessageService.buildToastMessage(error, "EDIT", "ERROR");
        console.warn("error", error.message);
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
        this.customMessageService.clearToastMessage();
      },
      () => this.ngxUiLoaderService.stop()
    );

  }

  deleteMultipleCall(event) {
    let deleteEndpoint = this.routerService.getPossibleEndpoints()['DELETE'].replace(":idConcession", this.idConcession)
    let finalValues = event;

    this.apiService.deleteData(deleteEndpoint, finalValues).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "DELETE", "SUCCESS");
      this.tableCpt.selectedRow = [];
      this.init();

    },
      (error) => {
        // se conforma el mensaje toast error en un servicio especial 
        this.customMessageService.buildToastMessage(error, "EDIT", "ERROR");
        console.warn("error", error.message);
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
        this.customMessageService.clearToastMessage();
      }
    );
  }
  
  getDataFromRoutinService(){
    if (this.routerService.isAdminContext()){
      this.entity = this.routerService.urlParams['admin-entity'] 
    }else if (this.routerService.isConcessionContext()){
      this.entity = this.routerService.getConcessionEntity()
    }
  }

  viewTableButton(button) {
    return !!this.tableButtons && !!this.tableButtons[button] ? this.tableButtons[button] : false;
  }

  /**
   * Evalua si se leyeron los datos de la tabla y los de los catalogos
   */
  get isDataGlobal() {
    return this.data.length !== 0 && this.loadedCatalogData;
  }

  get configureFields() {
    // si hay propiedad configure_columns
    return this.jsonData.table.configure_columns !== null && this.jsonData.table.configure_columns !== undefined? 
    // si es true coge las propiedades del json, y si no coge todas las propiedades (Fields estará vacío)
    this.jsonData.table.configure_columns ? this.viewDataFields: null
    // si no hay propiedad configure_columns coge igualmente el json
    : this.viewDataFields;
  }

  get thereIsjsonData() {
    return !!this.jsonData;
  }

  get thereIsPageSize() {
    return !!this.jsonData && !!this.jsonData.table!! && this.jsonData.table.pageSize.length !== 0;
  }

  get thereIsPageNumber() {
    return !!this.jsonData && !!this.jsonData.table && !!this.jsonData.table.pageNumber;
  }

  /**
   * Se cierran las subsripciones al destruirse componente
   */
  ngOnDestroy() {
    this.subsLan$.unsubscribe();
    this.subsRead$.unsubscribe();
    this.subsJson$.unsubscribe();
    this.subsTranslate$.unsubscribe();
    this.subsModal$.unsubscribe();
    this.subsRouter$.unsubscribe();
  }
}


