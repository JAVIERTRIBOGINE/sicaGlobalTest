import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as constants from 'src/app/core/config/const';
import * as ENTITIES from 'src/app/core/models/entities';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
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
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from 'src/app/core/services/account.service';
import { RouterService } from 'src/app/core/services/router.servcice';


@Component({
  selector: 'sica-delete-global',
  templateUrl: './delete-global.component.html',
  styleUrls: ['./delete-global.component.scss'],
  providers: [MessageService, TranslateService]
})
export class DeleteGlobalComponent implements OnInit, OnDestroy {
 /**
   * SUSCRIPCIONES. Se cierran en el OnDestroy
   * */
  subsLan$: Subscription = new Subscription();
  subsTranslate$: Subscription = new Subscription();
  subsJson$: Subscription = new Subscription();
  subsRead$: Subscription = new Subscription();
  subsModal$: Subscription = new Subscription();
  subsMessage$: Subscription = new Subscription();

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
  deleteData: any;
  entityEndpoint: any;
  action:string = constants.Actions.DELETE;

  constructor(
    public jsonService: JsonService,
    public messageService: MessageService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private dictionaryService: DictionaryService,
    private router: Router,
    private apiService: ApiService,
    public dataTransferService: DataTransferService,
    public location: Location,
    private ngxLoaderService: NgxUiLoaderService,
    public customMessageService: CustomMessageService,
    public accountService: AccountService,
    public routerService: RouterService
  ) {
    this.language$ = this.languageService.watchLanguage();
    this.routerService.conformNewGetIdModulesData(this.router);

    this.updatingtranslations();
  }
  ngOnInit(): void {
    this.routerService.conformNewGetIdModulesData(this.router);

    //Subscripción de lectura de json para la Search Table
    this.subsJson$ = this.jsonService.readAllFile(this.routerService.getJsonDeleteFileName()).subscribe(result => {
      this.jsonData = result;
      this.buttons = this.jsonData.buttons;
      this.searchAreas = result.area;
      // se mete este condicional porque la lectur del json del formulario de concesion es distinta, y
      // de momento no se leen catalogos sino que sus valores ya vienen en el json 
      this.dictionaryService.catalogsForForm(this.searchAreas);

      this.entityEndpoint = this.routerService.getPossibleEndpoints()['GET_BY_ID'];
        this.ngxLoaderService.start();
        this.apiService.getDataById(this.entityEndpoint).subscribe(data => {
          this.deleteData = data;
        },
          (error) => {
            console.warn(error);

          },
          () => {
            this.ngxLoaderService.stop();
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
  updatingtranslations() {
    this.subsLan$ = this.language$.subscribe(value => {
      this.subsTranslate$ =
        this.translate.use(value).subscribe(translation => {
          this.columns = [];
          this.defineFieldColumns(this.jsonData.table.dataFields);
        });
    });
  }

  delete() {
    let value = this.deleteData.data.id;
    this.apiService.deleteData(this.routerService.getPossibleEndpoints()['DELETE'], value).subscribe(data => {
      let customData = {
        id: this.deleteData.data.id,
        concesionId: this.routerService.getIdConcession()
      }
      this.customMessageService.buildToastMessage(customData, "DELETE", "SUCCESS");
      this.back();
    },
      (error) => {
        console.warn("error", error.message);
        this.customMessageService.buildToastMessage(error, "DELETE", "ERROR");
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
        this.customMessageService.clearToastMessage();
      }
    );
  }

  back(){
    this.location.back();
  }

  get viewCrateButton(){
    return false;
  }

  get isDataGlobal() {
    return !! this.data && this.loadedCatalogData;
  }

  get formDataLoaded() {
    return this.jsonData !== null && this.jsonData !== undefined;
  }

  get deleteDataLoaded() {
    return this.deleteData !== null && this.deleteData !== undefined;
  }

  get editWithDatOrCreateForm() {
    let deleteData = this.deleteData !== null && this.deleteData !== undefined ;

    
    return (this.formDataLoaded && deleteData )
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
  }
}


