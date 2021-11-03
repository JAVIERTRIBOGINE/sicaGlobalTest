import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as constants from 'src/app/core/config/const';
import * as ENTITIES from 'src/app/core/models/entities';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { DialogService } from 'primeng/dynamicdialog';
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
import { Location } from '@angular/common';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { AccountService } from 'src/app/core/services/account.service';
import { RouterService } from 'src/app/core/services/router.servcice';
import { convertSearchArea } from 'src/app/core/services/utils.service'


@Component({
  selector: 'sica-view-global',
  templateUrl: './view-global.component.html',
  styleUrls: ['./view-global.component.scss'],
  providers: [DialogService, MessageService, TranslateService]
})
export class ViewGlobalComponent implements OnInit, OnDestroy {
  /**
   * SUSCRIPCIONES. Se cierran en el OnDestroy
   * */
  subsLan$: Subscription = new Subscription();
  subsTranslate$: Subscription = new Subscription();
  subsJson$: Subscription = new Subscription();
  subsRead$: Subscription = new Subscription();
  subsModal$: Subscription = new Subscription();
  subsMessage$: Subscription = new Subscription();
  subsApiJson$: Subscription = new Subscription();
  subsById$: Subscription = new Subscription();

  //----

  subsTransfer$: Subscription = new Subscription();
  dataTransfer$: Observable<number>;

  // Observable ante cambios de lengua en traducciones
  language$: Observable<string>;

  message$: Observable<any>;


  // url de JSON de search table
  jsonFile: string = "";

  // datos de JSON de Search Table
  jsonData: any;

  // datos que se pasan a la Search Table
  data: ENTITIES.Reading = null;

  // campos de columna que se pasan a la Search Table
  columns: INTERFACES.column[] = [];

  // campo que alberga registros múltiples
  dto_multipleRecords: string = "";

  searchAreas: any[];

  //valores recogidos de la url
  staticConcession: string = "";
  concessionSlug: string = "";
  entityConcessionSlug: string = "";
  constantEntitieConfig: INTERFACES.entityConfigData;

  //comunicaremos con el tableComponent para pasarle valores de filtros
  @ViewChild("tableCpt", { static: false }) tableCpt: TableComponent;
  filteredData: DataTransfer[];
  dataFields: INTERFACES.dataFields[];
  buttons: INTERFACES.buttons;
  catalogsData: CatalogData[][] = [];
  loadedCatalogData: boolean = true;
  idView: string;
  idRow: string;
  allowedActions: string[];
  chosenEntity: string;
  editData: any;
  entityEndpoint: INTERFACES.apiReference;
  viewTable: object;

  constructor(
    public dialogService: DialogService,
    public jsonService: JsonService,
    public messageService: MessageService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private dictionaryService: DictionaryService,
    private router: Router,
    private apiService: ApiService,
    public dataTransferService: DataTransferService,
    private _Activatedroute: ActivatedRoute,
    public location: Location,
    private ngxLoaderService: NgxUiLoaderService,
    public customMessageService: CustomMessageService,
    public accountService: AccountService,
    public routerService: RouterService
  ) {
    this.language$ = this.languageService.watchLanguage();
    this.routerService.conformNewGetIdModulesData(this.router);

  }
  ngOnInit(): void {
    this.routerService.conformNewGetIdModulesData(this.router);
    this.entityEndpoint = this.routerService.getPossibleEndpoints();

    //Subscripción de lectura de json para la Search Table
    if (this.routerService.isMasterModule) this.readJsonFromApi();
    else this.readJsonFromProject()

  }

  readJsonFromProject() {
    this.subsJson$ = this.jsonService.readAllFile(this.routerService.getJsonViewFileName()).subscribe(result => {
      this.jsonData = result;
      this.buttons = this.jsonData.buttons;
      this.searchAreas = result.area;
      // se mete este condicional porque la lectur del json del formulario de concesion es distinta, y
      // de momento no se leen catalogos sino que sus valores ya vienen en el json 
      this.dictionaryService.catalogsForForm(this.searchAreas);

      this.ngxLoaderService.start();
      this.subsById$ = this.apiService.getDataById(this.entityEndpoint.GET_BY_ID).subscribe(data => {
        this.editData = data;
        if (!!result.table) this.getTableViewData(result.table);
      },
        (error) => {
          console.warn(error);

        },
        () => {
          this.ngxLoaderService.stop();
          if (!!this.customMessageService.getToastMessage()) {
            this.messageService.add(
              this.customMessageService.getToastMessage()
            );
          }
        }
      );
    });
  }

  readJsonFromApi() {
    let apiParam = {
      plantilla: {
        maestro: this.routerService.getAdditionalRoutingParameter()
      },
      entidad: {
        Maestro: this.routerService.entitieReference.routing_additional_parameter,
        EntidadId: this.routerService.urlParams['id']
      }
    };
    this.subsApiJson$ = this.apiService.getJsonDataByApi(this.entityEndpoint.GET_TEMPLATE, apiParam.plantilla).subscribe(result => {
      this.jsonData = convertSearchArea(result['data'], 'view');
      this.buttons = this.jsonData.buttons;
      this.searchAreas = this.jsonData.area;
      // se mete este condicional porque la lectur del json del formulario de concesion es distinta, y
      // de momento no se leen catalogos sino que sus valores ya vienen en el json 
      this.dictionaryService.catalogsForForm(this.searchAreas);

      this.ngxLoaderService.start();
      this.subsById$ = this.apiService.getMasterDataById(this.entityEndpoint.GET_BY_ID, apiParam.entidad).subscribe(data => {
        this.editData = data;
        this.editData.data.maestro = this.routerService.urlParams['admin-subentity'];

      },
        (error) => {
          console.warn(error);

        },
        () => {
          this.ngxLoaderService.stop();
          if (!!this.customMessageService.getToastMessage()) {
            this.messageService.add(
              this.customMessageService.getToastMessage()
            );
          }
        }
      );

    });
  }

  /**
   * Con los datos recogidos de back, se identifican y recogen los campos de
   * la tabla
   * @param jsonFields 
   */
  defineFieldColumns(jsonFields) {
    for (let field of jsonFields) {
      this.columns.push({ field: field['DTO'], header: this.translate.instant(field['LABEL']), filter: 'true', sortable: 'true', filterMatchMode: "equals" });
    }
  }



  /**
   * Cambios de traducciones ante posibles cambios de lenguage
   */
  updatingtranslations(tableJson) {
    this.columns = [];
    this.defineFieldColumns(tableJson.dataFields);
  }

  back() {
    this.location.back();
  }

  getTableViewData(tableJson) {
    this.viewTable = {
      dataFields: tableJson.dataFields,
      pageNumber: tableJson.pageNumber,
      pageSize: tableJson.pageSize,
      rows: constants.tablePageSize,
      tableButtons: !!tableJson.tableButtons ? tableJson.tableButtons : null,
      isModal : !!tableJson?.isModal? tableJson.isModal:false
    };
    this.updatingtranslations(tableJson);
    this.dictionaryService.catalogsForTable(tableJson.dataFields);
    if (this.thereIsEndPointInTable(tableJson)) {
      this.getDataFromApi();
    } else {
      Object.assign(this.viewTable, { data: this.editData.data.detalleNotificaciones });
    }
  }

  public thereIsEndPointInTable(tableJson) {
    return !!tableJson.getByEndpoint && tableJson?.getByEndpoint;
  }

  getDataFromApi() {
    let viewTableEndpoint = this.routerService.getPossibleEndpoints();
    this.apiService.getData(viewTableEndpoint.GET_DETAIL_BY_ID, null)
      .subscribe(dataTable =>
        Object.assign(this.viewTable, { data: dataTable.data }));
  }




  get viewCrateButton() {
    return false;
  }

  get isDataGlobal() {
    return !!this.data && this.loadedCatalogData;
  }

  get formDataLoaded() {
    return this.jsonData !== null && this.jsonData !== undefined;
  }

  get editDataLoaded() {
    return this.editData !== null && this.editData !== undefined;
  }

  get editWithDatOrCreateForm() {
    let editData = this.editData !== null && this.editData !== undefined;
    return (this.formDataLoaded && editData)
  }

  get isPreferencesPage() { return this.routerService.getEntitieReference().routing_reference === 'account' }

  get isThereTable() {
    return !!this.viewTable;
  }

  get isThereDataTable() {
    return !!this.viewTable['data'];
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
    this.subsApiJson$.unsubscribe();
    this.subsById$.unsubscribe();
  }
}