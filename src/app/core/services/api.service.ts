import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dictionary } from '../models/dictionary';
import { map, tap } from 'rxjs/operators';
import * as INTERFACES from '../models/other-interfaces';
import * as constants from 'src/app/core/config/const'
import { exportExcel } from 'src/app/core/services/utils.service';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) { }

  public getData(url, params): Observable<any> {
    let apiParams = !!params ? this.addParameters(params) : "";
    let difiniteUrl = environment.urlBase + url + apiParams;
    return this.http.get(difiniteUrl);
  }

  getExcelFile(url, params) {
    let difiniteUrl = environment.urlBase + url;
    return this.http.get(difiniteUrl,
      {
        responseType: 'blob',
        params: params
      }
    )
  }


  public getJsonFileFromApi(url, params?): Observable<any> {
    let apiParams = !!params ? this.addParameters(params) : "";
    let difiniteUrl = environment.urlBase + url + apiParams;
    return this.http.get(difiniteUrl);
  }

  public getGenericData<T>(url): Observable<INTERFACES.GenericGetResponse<T>> {
    return this.http.get<INTERFACES.GenericGetResponse<T>>(environment.urlBase + url);
  }

  /**
   * 
   * @param url 
   * @param id id del registro a visualizar
   * @param responseType 
   * @returns 
   */
  public getDataById(url, responseType?): Observable<any> {
    const respType = responseType ? responseType : { responseType: 'json' };
    let definiteUrl = environment.urlBase + url;
    return this.http.get(definiteUrl, respType);
  }

  /**
   * 
   * @param url 
   * @param id id del registro a visualizar
   * @param responseType 
   * @returns 
   */
  public getMasterDataById(url, params): Observable<any> {
    let definiteUrl = environment.urlBase + url;
    return this.http.get(definiteUrl, { params: params });
  }


  /**
   * llamada a api para insertar registro
   * @param url url de la llamada
   * @param params id del registro a insertar
   * @returns 
   **/
  public postData(url, params, responseType?): Observable<any> {
    const respType = responseType ? responseType : { responseType: 'json' };
    let defineUrl = environment.urlBase + url;
    return this.http.post(environment.urlBase + url, params, respType);
  }

  public postExcelData(url, body): Observable<any> {
    let defBody = body[0];
    const formDataExemple = new FormData();
    formDataExemple.append('file', defBody, defBody.name);
    let defineUrl = environment.urlBase + url;
    return this.http.post(defineUrl, formDataExemple);
  }

  /**
   * llamada a api para actualizar registro
   * @param url url de la llamada
   * @param params id del registro a actualizar
   * @returns 
   **/
  public putData(url, params): Observable<any> {
    let defineUrl = environment.urlBase + url;

    return this.http.put(defineUrl, params);
  }

  /**
   * llamada a api para eliminar registro
   * @param url url de la llamada
   * @param params id del registro a eliminar
   * @returns 
   */
  public patchData(url, params): Observable<any> {
    let defineUrl = environment.urlBase + url;

    return this.http.patch(defineUrl, params);
  }

  /**
   * llamada a api para eliminar registro
   * @param url url de la llamada
   * @param params id del registro a eliminar
   * @returns 
   */
  public deleteData(url, params, responseType?): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: params,
    };

    let defineUrl = environment.urlBase + url;
    return this.http.delete(defineUrl, options
    )
  }

  public disactivateEntityMaster(url, params, responseType?): Observable<any> {
    let defineUrl = environment.urlBase + url;
    return this.http.delete(defineUrl, params)
  }

  public readJson(route): Observable<any> {
    return this.http.get(route);
  }

  /**
   * Lee datos a api de catálogos
   * @param url url remota de llamaga
   * @param isoLang lenguage a introducir en los catalogos
   * @returns 
   */
  public getDictionaryData(url, isoLang): Observable<any> {
    let httpParams = new HttpParams({ fromString: "LanguageIsoCode=" + isoLang });
    return this.http.get(environment.urlBase + environment.masterEndpoints[url], { params: httpParams })
      .pipe(map(result => result['data']
        .map(function (res) {
          return { 'nombre': res.title, 'valor': res.id }
        })));
  }

  public getDictionaryDataWithOutIsoCode(url): Observable<any> {
    return this.http.get(environment.urlBase + environment.masterEndpoints[url])
      .pipe(map(result => result['data']
        .map(function (res) {
          return { 'nombre': res.title, 'valor': res.id }
        })));
  }

  /**
 * NUEVA ACCION: Lee datos a api de catálogos
 * @param url url remota de llamaga
 * @param isoLang lenguage a introducir en los catalogos
 * @returns 
 */
  public getNewDictionaryData(_master: string, isoLang): Promise<INTERFACES.CatalogData[]> {
    return new Promise((resolve, reject) => {
      let httpParams = new HttpParams().set(
        'Maestro', _master).set('LanguageIsoCode', isoLang);
      this.http.get(environment.urlBase + environment.endpoints.mastersData, { params: httpParams }).toPromise().
        then(result => {
          let data = result['data']
          let options: INTERFACES.CatalogData[] = []
          // mapeamos resultado para encajarlo con lo estructura de options de selectro
          data.map(function (res) {
            options.push({ 'nombre': res.etiqueta, 'valor': res.id })
          });

          resolve(options);
        })
    }
    )
  }

  getJsonDataByApi(url, param) {
    let httpParams = new HttpParams().set(
      'maestro', param.maestro)
    return this.http.get(environment.urlBase + url, { params: httpParams })
  }

  async getApiMasterEntitiesTraductions(master, idEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      let httpParams = new HttpParams().set(
        'Maestro', master).set('EntidadId', idEntity);
      this.http.get(environment.urlBase + environment.endpoints.entityMasterById, { params: httpParams }).toPromise().
        then((result: object) => {
          resolve(result['data'].traducciones);
        })
    }
    )
  }

  /**
   * añade los parámetros en el string de la url
   * @param params parámetros a añadir
   * @returns 
   */
  addParameters(params) {
    let queryParams: string = "?";
    let queryParam: string;
    for (let param in params) {
      queryParam = param + "=";
      if (params[param] === null || params[param] === undefined) { 
        continue;
       } else {
        queryParams = typeof (params[param]) === "object" ?

          queryParams + queryParam + params[param].join(',') + "&" :

          queryParams + queryParam + params[param] + "&";
      }
    }
    return queryParams.substring(0, queryParams.length - 1);
  }

  /**
   * ajusta los parámetros concretamente para llamadas para coger datos a pintar 
   * en pdf o xlsx
   * @param apiParams parámetros a pasar en la llamada
   * @returns 
   */
  conformExportDataParams(apiParams) {
    let auxParams = Object.assign({}, apiParams);
    delete auxParams.pageNumber;
    delete auxParams.pageSize;
    auxParams.ApplyPagination = false;
    return auxParams;
  }
}
