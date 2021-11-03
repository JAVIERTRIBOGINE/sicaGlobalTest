import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { AccountService } from 'src/app/core/services/account.service';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { RouterService } from 'src/app/core/services/router.servcice';
import { changeDateToIso } from 'src/app/core/services/utils.service';
import { convertSearchArea } from 'src/app/core/services/utils.service'


@Component({
  selector: 'sica-edit-global',
  templateUrl: './edit-global.component.html',
  styleUrls: ['./edit-global.component.scss'],
  providers: [DialogService, MessageService, TranslateService]
})
export class EditGlobalComponent implements OnInit, OnDestroy {
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

  // Observable ante cambios de lengua en traducciones
  language$: Observable<string>;

  // url de JSON de search table
  jsonFile: string = "";

  // datos de JSON de Search Table
  jsonData: any;

  // datos que se pasan a la Search Table
  data: ENTITIES.Reading[] = [];

  // campo que alberga registros múltiples
  dto_multipleRecords: string = "";

  searchAreas: INTERFACES.searchAreas[];

  //valores recogidos de la url
  staticConcession: string = "";
  concessionSlug: string = "";
  entityConcessionSlug: string = "";
  constantEntitieConfig: INTERFACES.entityConfigData;
  idRow: string;
  action: string = "";
  editData: any = null;
  entityEndpoint: INTERFACES.apiReference;
  idConcession: string;
  concessionForm: boolean = false;
  buttons: any;



  constructor(
    public dialogService: DialogService,
    public jsonService: JsonService,
    public messageService: MessageService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private dictionaryService: DictionaryService,
    public routerService: RouterService,
    private router: Router,
    private apiService: ApiService,
    public dataTransferService: DataTransferService,
    public ngxUiLoaderService: NgxUiLoaderService,
    public accountService: AccountService,
    public customMessageService: CustomMessageService,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.language$ = this.languageService.watchLanguage();
    // this.routerService.conformConcessionGetIdModulesData(this.router.url);
    this.routerService.conformNewGetIdModulesData(this.router);
    this.updatingtranslations();
    this.action = this.routerService.getAction()
  }

  /**
   * Cambios de traducciones ante posibles cambios de lenguage
   */
   updatingtranslations() {
    this.subsLan$ = this.language$.subscribe(value => {
      this.subsTranslate$ =
        this.translate.use(value).subscribe(translation => {
        });
    });
  }

  ngOnInit(): void {
    // this.routerService.conformConcessionGetIdModulesData(this.router.url);
    this.routerService.conformNewGetIdModulesData(this.router);
    this.entityEndpoint = this.routerService.getPossibleEndpoints();
    //Subscripción de lectura de json para la Search Table
    if (this.routerService.isMasterModule) {
      this.readJsonMasterFromApi();
    } else {
      this.readJsonFromProject();
    }
  }

  // lectura de json de los archivos de proyect
  readJsonFromProject() {
    this.subsJson$ = this.jsonService.readAllFile(this.routerService.getJsonFormFileName()).subscribe(result => {
      this.jsonData = result;
      this.buttons = this.jsonData.buttons;
      this.searchAreas = result.area;
      // se mete este condicional porque la lectur del json del formulario de concesion es distinta, y
      // de momento no se leen catalogos sino que sus valores ya vienen en el json 
      this.dictionaryService.catalogsForForm(this.searchAreas);

      if (this.action === constants.Actions.EDIT) {
        this.ngxUiLoaderService.start();
        this.subsById$ = this.apiService.getDataById(this.entityEndpoint.GET_BY_ID).subscribe(data => {
          this.editData = data;
        },
          (error) => {
            console.warn(error);

          },
          () => {
            this.ngxUiLoaderService.stop();
            if (!!this.customMessageService.getToastMessage()) {
              this.messageService.add(
                this.customMessageService.getToastMessage()
              );
            }
          }
        );
      }
    });
  }

  // lectura de json de api (SOLO EN MAESTROS)
  readJsonMasterFromApi() {
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
      this.jsonData = convertSearchArea(result['data'], this.action === constants.Actions.EDIT?'edit':'create');
      this.buttons = this.jsonData.buttons;
      this.searchAreas = this.jsonData.area;
      // se mete este condicional porque la lectur del json del formulario de concesion es distinta, y
      // de momento no se leen catalogos sino que sus valores ya vienen en el json 
      this.dictionaryService.catalogsForForm(this.searchAreas);
      
      if (this.action === constants.Actions.EDIT) {
        this.ngxUiLoaderService.start();
      this.subsById$ = this.apiService.getMasterDataById(this.entityEndpoint.GET_BY_ID, apiParam.entidad).subscribe(data => {
        this.editData = data;
        this.editData.data.maestro = this.routerService.urlParams['admin-subentity']
      },
        (error) => {
          console.warn(error);

        },
        () => {
          this.ngxUiLoaderService.stop();
          if (!!this.customMessageService.getToastMessage()) {
            this.messageService.add(
              this.customMessageService.getToastMessage()
            );
          }
        }
      );

    }else{
      this.editData = {
        data: {
          maestro: this.routerService.urlParams['admin-subentity'],
          orden: 0,
          activo: true
        }
      } 
    }
    });
  }


  // METODO QUE SE LLAMA DESPUÉS DE PULSAR SUBMIT EN CPTE  HIJO (NGFORMS)
  customSubmit(event) {

    switch (this.action) {
      case constants.Actions.EDIT:
        this.edit(event);
        break;
      case constants.Actions.CREATE:
        this.create(event);
        break;
      case constants.Actions.DELETE:
        this.delete(event);
        break;
    }
  }

  //------------ LLAMADAS SEGÚN LO QUE LLEGUE DEL EVENTO SUBMIT DEL CPTE HIJO

  private edit(values) {
    let finalValues = changeDateToIso(this.jsonData.area, values);
    if (this.routerService.isMasterModule) finalValues = { objeto: finalValues }
    this.apiService.putData(this.entityEndpoint['PUT'], finalValues).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "EDIT", "SUCCESS");
      if (this.isPreferencesPage) {
        this.updateCachedUserSettings(values);
        this.languageService.setLanguage(values['idiomaPreferido']);
        this.router.navigate(['/']);
      }
      else {
        this.location.back();
      }
    },
      (error) => {
        // se conforma el mensaje toast error en un servicio especial 
        console.warn("error", error.message);
        this.customMessageService.buildToastMessage(error, "EDIT", "ERROR");
        this.messageService.add(
          this.customMessageService.getToastMessage()
        );
      }
    );
  }

  private create(values) {
    // var values = this.globalForm.value;
    let finalValues = changeDateToIso(this.jsonData.area, values);
    if (this.routerService.isMasterModule) {
      finalValues.maestro = this.routerService.urlParams['admin-subentity']
      delete finalValues.activo;
      finalValues = { 
      objeto: finalValues
    }
  }
    this.apiService.postData(this.entityEndpoint['POST'], finalValues).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "INSERT", "SUCCESS");
      this.location.back();
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

  private delete(values) {
    let value = values.id;
    this.apiService.deleteData(this.routerService.getPossibleEndpoints()['DELETE'], value).subscribe(data => {
      let customData = {
        id: values.id,
        concesionId: this.routerService.getIdConcession()
      }
      this.customMessageService.buildToastMessage(customData, "DELETE", "SUCCESS");
      this.router.navigate(['../../'], { relativeTo: this.route });
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

  //------------------



  updateCachedUserSettings(values) {
    let userSettings = JSON.parse(sessionStorage.getItem('userSettings'));
    userSettings.formatoFechaHoraId = values.formatoFechaHora;
    userSettings.formatoNumericoId = values.formatoNumerico;
    userSettings.idiomaPreferidoId = values.idiomaPreferido;
    sessionStorage.setItem('userSettings', userSettings);
  }

  

  get isPreferencesPage() { return this.routerService.getEntitieReference().routing_reference === 'account' }

  get formDataLoaded() {
    return this.jsonData !== null && this.jsonData !== undefined;
  }

  get editDataLoaded() {
    return this.editData !== null && this.editData !== undefined;
  }

  get editWithDatOrCreateForm() {
    let editAndData = this.action === constants.Actions.EDIT && this.editData !== null && this.editData !== undefined;
    let create = this.action === constants.Actions.CREATE;


    return (this.formDataLoaded && (editAndData || create))
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