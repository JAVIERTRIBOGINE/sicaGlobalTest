import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import * as constants from 'src/app/core/config/const';
import { forkJoin, Subscription } from 'rxjs';
import { JsonService } from '../../core/services/json.service';
import { DictionaryService } from '../../core/services/dictionary.service';
import { RouterService } from '../../core/services/router.servcice';
import { ApiService } from '../../core/services/api.service';
import * as FileSaver from "file-saver";



@Component({
  selector: 'sica-multi-language',
  templateUrl: './multi-language.component.html',
  styleUrls: ['./multi-language.component.scss'],
})
export class MultilanguageComponent implements OnInit, OnDestroy {
  // subscriptions
  subsJson$: Subscription = new Subscription();
  subsData$: Subscription = new Subscription();
  jsonDataCatalog: INTERFACES.jsonViewData;
  jsonDataUpload: INTERFACES.jsonViewData;
  generalTitle: string;
  searchAreas: INTERFACES.searchAreas[];
  allLoaded: boolean = false;
  created: number = 0;
  updated: number = 0;
  failed: number = 0;
  excelSubs$: Subscription = new Subscription();
  resultsData: boolean = false;
  idError: any;
  
  constructor(
    private router: Router,
    private jsonService: JsonService,
    public dictionaryService: DictionaryService,
    public routerService: RouterService,
    public apiService: ApiService
  ) {

    this.routerService.conformNewSearchModulesData(this.router);
  }

  public ngOnInit(): void {
    this.subsJson$.add(
      forkJoin([
        this.apiService.getData(constants.ENTITY_REFERENCES.MULTILENGUAGE.api_reference.GET_MODULES, null),
        this.jsonService.readAllFile(
          constants.ENTITY_REFERENCES.MULTILENGUAGE.jsonModulesFileName),
        this.jsonService.readAllFile(
          constants.ENTITY_REFERENCES.MULTILENGUAGE.jsonUploadFileName),
      ]).subscribe(
        ([dataOptionsModules, jsonDataModules, dataUpload]) => {
          this.jsonDataCatalog = jsonDataModules;
          this.jsonDataUpload = dataUpload;
          dataOptionsModules.data.forEach(element => {
            this.jsonDataCatalog.area[0].data.push({ valor: element.id, nombre: element.etiqueta })

          });

          this.generalTitle = "Multi Idioma";

          // se cargan catalogos en la tabla y en el formulario de filtros, si hay
          this.allLoaded = true;
        })
    )
  }

  get catalogAndUploadLoaded() {
    return this.allLoaded;
  }

  get areResultsData() {
    return this.resultsData;
  }

  get isFailed() {
    return this.failed > 0
  }

  dataLoadExcel(event: any) {
    this.excelSubs$ = this.apiService.getExcelFile(constants.ENTITY_REFERENCES.MULTILENGUAGE.api_reference.GET_TEMPLATE, event).subscribe(
      (resp: Blob) => {
        let Module = event.Modulo;
        let idioma = event.IdiomaId;
        const data: Blob = new Blob([resp], { type: constants.EXCEL_TYPE })
        FileSaver.saveAs(resp, Module + '-' + constants.LANGUAGE[idioma] + '.xlsx');
      }, error => console.error("error en excel call", error))
  }

  submitUpload(event) {
    this.apiService.postExcelData(constants.ENTITY_REFERENCES.MULTILENGUAGE.api_reference.POST_TEMPLATE, event).subscribe(
      evaluation=> {
        this.created = evaluation.data.entidadesInsertadas;
        this.updated = evaluation.data.entidadesActualizadas;
        this.failed = evaluation.data.entidadesError;
        this.idError = evaluation.data.transacionErrorId;
        this.resultsData = true;
      });
    
  }


  downloadFailExcel() {

    this.excelSubs$ = this.apiService.getExcelFile(constants.ENTITY_REFERENCES.MULTILENGUAGE.api_reference.GET_ERROR_TEMPLATE, {ErrorId: this.idError}).subscribe(
      (resp: Blob) => {
        let fileName = "errores-" + this.idError + ".xlsx";
        const data: Blob = new Blob(
          [resp], { type: constants.EXCEL_TYPE })
        FileSaver.saveAs(data, fileName);
        this.initializeResultsData();
      }, 
      error => console.error("error en excel call", error))
  }


  initializeResultsData() {
    this.created = this.updated = this.failed = 0;
    this.resultsData = false;
  }

  ngOnDestroy() {
    this.excelSubs$.unsubscribe();
  }

}
