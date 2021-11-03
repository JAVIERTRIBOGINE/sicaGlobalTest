import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { Catalog } from '../models/other-interfaces';
import { LanguageService } from './language.service';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from './account.service';
import { ThisReceiver } from '@angular/compiler';
import { RouterService } from './router.servcice';

@Injectable({
  providedIn: 'root'
})

export class DictionaryService {
  catalogs: Catalog[] = [];
  estadoLecturaName = "estadolecturas";
  idiomasName = "idiomas";
  punctuationName = "punctuation";
  fechahoraName = "fechahora";
  isoLan = ["es", "ca"];
  catalogsub$: Subscription = new Subscription();
  loadedCatalog$: Subject<boolean> = new Subject<boolean>()
  catalogLoaded: boolean = false;
  dataCatalog: INTERFACES.CatalogData[];
  pageCatalogs: INTERFACES.PageCatalog[] = [];
  
  constructor(
    private apiService: ApiService,
    private languageService: LanguageService,
    public ngxLoader: NgxUiLoaderService,
    private accountService: AccountService,
    public routerService: RouterService
  ) {

  }


  getDataDictionaries(entity, lang) {
    if (lang)
      return this.apiService.getDictionaryData(entity, lang);
    return this.apiService.getDictionaryDataWithOutIsoCode(entity)
  }

  loadCatalogs() {
    this.mockCatalogData();

    if (this.checkIfAccountAllowed())
      this.setPermissions();
  }

  /**
   * coge los datos de todos los posibles permisos de la aplicación
   */
  setPermissions() {
    let apiParams = {
      applyPagination: false
    };
    this.apiService.getData(environment.endpoints.permissions, apiParams).subscribe(
      response => {
        sessionStorage.setItem(constants.SESSION_STORAGE_LABELS.ALL_PERMISSIONS, JSON.stringify(response.data))
      }
    );
  }

  async catalogsForTable(tableFields) {
    this.pageCatalogs = [];
    let pageCatalog: INTERFACES.PageCatalog;
    let dataCatalog: INTERFACES.CatalogData[];
    let catalogsFound: string[] = [];
    tableFields.forEach(async column => {
      if (!!column.catalog) {
        dataCatalog = await this.apiService.getNewDictionaryData(column.catalog, this.languageService.getLanguage());
        pageCatalog = {
          name: column.catalog,
          options: dataCatalog
        };
        if (!catalogsFound.includes(column.catalog)) {
          catalogsFound.push(column.catalog);
          this.pageCatalogs.push(pageCatalog);
        }
      }
    });
  }

  async catalogsForSearch(tableFields) {
    tableFields.forEach(async column => {
      if (!!column.catalog) {
        if (!column.data || column.data?.length === 0) column.data = await this.apiService.getNewDictionaryData(column.catalog, this.languageService.getLanguage());
      }
    });

  }

  async catalogsForForm(searchFields) {
    if (!this.routerService.isMasterModule) {
      searchFields?.forEach(area => {
        area['subArea'].forEach(async (column: any) => {
          if (!!column.catalog) {
            if (!column.data || column.data?.length === 0) column.data = await this.apiService.getNewDictionaryData(column.catalog, this.languageService.getLanguage());
          }
        });
      });
      this.catalogLoaded = true;
    }
  }


  getCachedCatalogs() {
    if (this.catalogs.length === 0) this.catalogs = JSON.parse(sessionStorage.getItem(constants.SESSION_STORAGE_LABELS.ALL_CATALOGS));
  }

  cachedCatalogs(): boolean {
    return !!sessionStorage.getItem(constants.SESSION_STORAGE_LABELS.ALL_CATALOGS);
  }

  mockCatalogData() {
    this.catalogs.push({
      name: "tipoLectura",
      isoLang: "es",
      options: [{
        nombre: "tipo lectura 1",
        valor: 1
      }, {
        nombre: "tipo lectura 2",
        valor: 2
      }]
    });
    this.catalogs.push({
      name: "tipoLectura",
      isoLang: "ca",
      options: [{
        nombre: "tipus lectura 1",
        valor: 1
      }, {
        nombre: "tipus lectura 2",
        valor: 2
      }]
    });
  }

  async getMasterEntitiesTraductions(data, master) {
    data.forEach(async row => {
      row['traductions'] = await this.apiService.getApiMasterEntitiesTraductions(master, row.id);
    });
  }

  getTranslatedData(catalogName: string) {
    this.catalogsub$.add(
      forkJoin([
        this.getDataDictionaries(catalogName, this.isoLan[0]),
        this.getDataDictionaries(catalogName, this.isoLan[1])]
      ).subscribe(
        ([dataCatalogsEs, dataCatalogsCa]) => {
          [dataCatalogsEs, dataCatalogsCa].forEach((element, i) => {
            this.catalogs.push({
              name: catalogName,
              isoLang: this.isoLan[i],
              options: element
            });
          });
          sessionStorage.setItem(constants.SESSION_STORAGE_LABELS.ALL_CATALOGS, JSON.stringify(this.catalogs));
        },
        (error) => console.warn(error),
        () => this.ngxLoader.stop()
      )
    )
  }

  getNoTranslatableData(catalogName: string) {
    this.catalogsub$.add(
      this.getDataDictionaries(catalogName, null).subscribe(response => {
        this.isoLan.forEach((lan) => {
          this.catalogs.push({
            name: catalogName,
            isoLang: lan,
            options: response
          })
        })
        sessionStorage.setItem(constants.SESSION_STORAGE_LABELS.ALL_CATALOGS, JSON.stringify(this.catalogs));
      })
    )
  }

  renderDataCatalogs(colKey, colData, dataFields) {
    this.getCachedCatalogs();
    let selectedCatalog;
    let catalogOptions = []
    let selectedField = dataFields.find(field => field['DTO'] === colKey);
    if (!!selectedField.catalog) {
      selectedCatalog = this.catalogs.find(
        catalog => catalog.isoLang === this.languageService.getLanguage()
          && catalog.name === selectedField.catalog
      )
      catalogOptions = selectedCatalog.options;
      let valor_a_meter = catalogOptions.find(
        rowCatalog => rowCatalog['valor'] === colData);

      return valor_a_meter['nombre'];
    } else {
      return colData;
    }


  }


  isFilled() {
    return this.catalogLoaded;
  }

  checkIfAccountAllowed(): boolean {
    const permisions = this.accountService.getPermissions();

    for (let i = 0; i < permisions.length; i++) {
      if (permisions[i].account?.length > 0)
        return true
    }

    return false;
  }
}