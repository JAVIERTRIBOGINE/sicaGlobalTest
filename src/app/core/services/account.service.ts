import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as utilsService from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import * as ENTITIES from 'src/app/core/models/entities';
import * as constants from 'src/app/core/config/const';


@Injectable({
  providedIn: 'root',
})

export class AccountService {
  permissions: any[] = [];
  allowedConcessions: INTERFACES.OptionsSelector[] = [];
  mockReportDefault: boolean = true;
  userData: ENTITIES.ACCOUNT = null;
  unauthorizedPermission: INTERFACES.UnauthorizedPermissionMessage
  showReporting: Subject<boolean> = new Subject<boolean>();
  allowedEntities: Subject<string[]> = new Subject<string[]>();
  subsRead$: Subscription = new Subscription();
  


  constructor( private apiService: ApiService, private translate: TranslateService
  ) { }

  matchShowReporting(): Observable<boolean> {
    return this.showReporting.asObservable();
  }

  setShowReporting(show: boolean) {
    this.showReporting.next(show);
  }

  matchAllowedEntities(): Observable<string[]> {
    return this.allowedEntities.asObservable();
  }

  setAllowedEntities(entities: string[]) {
    this.allowedEntities.next(entities);
  }

  buildPermissionsObject() {
    if (!this.cachedData()) {
      let userData = JSON.parse(sessionStorage.getItem("angular_spa_userData"));
      let userPermissions = JSON.parse(userData.permissions);
      this.permissions = this.permissions.concat(userPermissions);
      this.allowedConcessions = this.permissions.map(function (permission) {
        return { value: permission.concessionCode, name: permission.concessionName, id: permission.concessionId , link: 
          constants.ROUTING_CONCESSION_BASE + "/" + constants.ROUTING_REFERENCES.LECTURA};
      }
      );
      this.buildingAllowedActionsByEntitiesByConcession();
      this.buildUserSettingsObject(userData);
      this.setDataInNavigator();
    } else {
      this.getDataInNavigator()
    }
  }

  buildingAllowedActionsByEntitiesByConcession() {
    let actionsOfEntity: any[] = [];
    let entityAction: string[] = [];
    let allowedEntities: string[] = [];
    this.permissions.forEach((concession, index) => {
      allowedEntities = [];
      actionsOfEntity = [];
      concession.roles.forEach(roles => {
        roles.permissions.forEach(permission => {
          entityAction = permission.split('.');
          if (!!actionsOfEntity[entityAction[0]]) {
            if (!allowedEntities.includes(entityAction[0])) allowedEntities.push(entityAction[0]);
            if (!actionsOfEntity[entityAction[0]].includes(entityAction[1])) {
              actionsOfEntity[entityAction[0]].push(entityAction[1]);
            }
          } else {
            actionsOfEntity[entityAction[0]] = []
            actionsOfEntity[entityAction[0]].push(entityAction[1]);
          }
        });
      });
      Object.assign(this.permissions[index], actionsOfEntity);
      this.permissions[index].allowedEntities = allowedEntities;
    });
  }

  setDataInNavigator() {
    sessionStorage.setItem("permissions", JSON.stringify(this.permissions));
    sessionStorage.setItem("allowedConcessions", JSON.stringify(this.allowedConcessions));
    sessionStorage.setItem("userSettings", JSON.stringify(this.userData));
    sessionStorage.setItem("reportDefault", JSON.stringify(this.mockReportDefault));
  }

  getDataInNavigator() {
    this.userData = JSON.parse(sessionStorage.getItem("userSettings"));
    this.permissions = JSON.parse(sessionStorage.getItem("permissions"));
    this.allowedConcessions = JSON.parse(sessionStorage.getItem("allowedConcessions"));
    this.mockReportDefault = JSON.parse(sessionStorage.getItem("reportDefault"));
  }

  getAllowedEntitesByConcession(concessionCode) {
    this.buildPermissionsObject()
    let permissionFound = this.permissions.find(permission => permission.concessionCode === concessionCode);
    let allowedEntitiesInConcession = !!permissionFound ? permissionFound.allowedEntities : [];
    return allowedEntitiesInConcession;
  }

  buildUserSettingsObject(userData?) {
    this.userData = {
      id: userData.sub,
      nombre: userData.name, 
      email: userData.email,
      nombreUsuario: userData.unique_name,
      idiomaPreferido: null,
      formatoNumerico: null,
      formatoFechaHora: null,
      esUsuarioLocal: "True"
    }
    let urlAccount = (constants.ENTITY_REFERENCES.USUARIOS.api_reference.GET_PREFERENCES.replace(":id", userData.sub));
    this.subsRead$ = this.apiService.getDataById(urlAccount).subscribe(
      user => 
      {
        this.userData.idiomaPreferido = user.data.idiomaPreferido;
        this.userData.formatoFechaHora = user.data.formatoFechaHora;
        this.userData.formatoNumerico = user.data.formatoNumerico;
        this.translate.setDefaultLang(this.getPreferedLanguage());

        this.setDataInNavigator();
        }
      );
  }

  cachedData() {
    return !!sessionStorage.getItem("reportDefault") && 
    !!sessionStorage.getItem("allowedConcessions") && 
    !!sessionStorage.getItem("userSettings");
    !!sessionStorage.getItem("permissions") ;
  }

  getAllowedActionsOfEntity(concession, entity) {
    let actions = this.permissions.find(permision => permision.concessionCode === concession);
    
    return !!actions?actions[entity]:[];
  }
  
  getUserAllowedActionsOfEntity(concession, entity){
    return this.permissions.find(permision => permision === concession);
  }

  isThereAllowedActionsOfEntity(concession, entity, action) {
    let entitySelected = this.permissions.find(permision => permision.concessionCode === concession);
    if (entitySelected.hasOwnProperty(entity)) return entitySelected[entity].includes(action)
    else return false;
  }

  public getPermissions() {
    return this.permissions;
  }

  public getAllowedConcessions() {
    return this.allowedConcessions;
  }

  public getIdConcession(consessionSlug) {
    const permissions = this.getPermissions();
    const concession = !!permissions? permissions.find(permission => permission.concessionCode === consessionSlug): null;
    const concessionId = !!concession? concession['concessionId']: null
    return concessionId;
  }

  public getNameConcession(consessionSlug) {
     const permissions = this.getPermissions();
    const concession = this.getPermissions().find(permission => permission.concessionCode === consessionSlug);
    const nameConcession = !!concession? concession['concessionName']: null;
    return nameConcession;
  }

  getEntitiesOfConcession(concession) {
    return this.permissions[concession].allowedEntities;
  }

  public getGrantAction(entityActions, action) {
    return entityActions.includes(action);
  }

  public getReportDefault() {
    return this.mockReportDefault;
  }

  /**GETTERS Y SETTERS NO AUTORIZADOS */

  setUnauthorizedConcession(concession, check) {
    this.unauthorizedPermission.codeConcession = {
      value: concession,
      check: check
    }
  }

  getUnauthorizedConcession() {
    return this.unauthorizedPermission?.codeConcession;
  }

  setUnauthorizedEntity(entity, check) {
    this.unauthorizedPermission.codeEntity = {
      value: entity,
      check: check
    }
  }

  getUnauthorizedEntity() {
    return !!this.unauthorizedPermission?.codeEntity?this.unauthorizedPermission.codeEntity: null;
  }

  setUnauthorizedAction(action, check) {
    this.unauthorizedPermission.codeAction = {
      value: action,
      check: check
    }
  }

  getUnauthorizedAction() {
    return !!this.unauthorizedPermission?.codeAction?this.unauthorizedPermission.codeAction: null;
  }

  // ---------------------------------------------


  /** GETTERS DE USUARIO */
  getUserDataName() {
    return this.userData.nombreUsuario;
  }

  getIdUser(){
    return this.userData.id;
  }

  getUserData() {
    return this.userData;
  }
  
  getPreferedLanguage() {
    return this.userData.idiomaPreferido;
  }

  getDateFormat() {
    return this.userData.formatoFechaHora;
  }

  getNumericFormat() {
    return this.userData.formatoNumerico;
  }
  
  
}
