import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})

export class RouterService {
  action: string;
  staticConcession: string;
  concessionSlug: string;
  idConcession: string;
  concessionEntity: string;
  idConcessionEntity: string;
  allowedActions: string[]
  entitieReference: INTERFACES.entityConfigData;
  possibleEndpoints: INTERFACES.apiReference = {};
  idConcesionEntity: string;
  idSubEntity: string;
  subEntity: string;
  staticUser: string;
  userId: any;
  userEntity: any;
  staticMaster: string = null;
  master: string = null;
  staticAdmin: string = null;
  urlParams: object;
  codeMaster: string;
  contextSlug: string;
  adminEntity: string;
  adminSubentity: string;
  idAdminEntity: any;
  concessionSubEntity: string;
  breadcrumbIts: MenuItem[]=[]

  constructor(
    private accountService: AccountService
  ) { }

  initializeData() {
    this.action = this.staticAdmin = this.staticConcession = this.concessionSlug = this.idConcession =
      this.concessionEntity = this.idConcessionEntity = this.allowedActions =
      this.entitieReference = this.possibleEndpoints = this.idSubEntity = this.subEntity = null;
    this.action = this.staticUser = this.userId = this.userEntity = this.allowedActions =
      this.master = this.staticMaster = this.entitieReference = this.possibleEndpoints = null;
  }

  conformNewSearchModulesData(router) {
    this.urlParams = this.getUrlParams(router);
    this.initializeData();
    let validUrl = router.url.split('/');
    
    validUrl.splice(0, 1);
    this.contextSlug = validUrl[0];
    
    
    switch (this.contextSlug) {
      // if the context is 'Concession'
      case constants.contextSlug.CONCESSION:
        this.assignUrlParams();
        this.entitieReference = this.selectEntitieReference(this.concessionEntity);
        this.possibleEndpoints = {
          GET: this.replacingConcessionEndpoints(this.entitieReference.api_reference.GET),
          DELETE: this.replacingConcessionEndpoints(this.entitieReference.api_reference.DELETE),
          ASSOCIATE: this.replacingConcessionEndpoints(this.entitieReference.api_reference.ASSOCIATE),
          DISASSOCIATE: this.replacingConcessionEndpoints(this.entitieReference.api_reference.DISASSOCIATE)
        }
        this.allowedActions = this.accountService.getAllowedActionsOfEntity(this.urlParams['concession'], this.entitieReference.auth_reference);
        this.breadcrumbIts = this.conformBreadbrumbItems(validUrl, 'concession')
        
        // if the context is 'Admin'
        break;
      case constants.contextSlug.ADMIN:
        if (this.isThereParam('admin-entity')) this.adminEntity = this.urlParams['admin-entity'];
        else this.adminEntity = validUrl[1];
        if (this.isThereParam('admin-subentity')) this.adminSubentity = this.urlParams['admin-subentity'];
        if (this.isThereParam('id')) this.idAdminEntity = this.urlParams['id'];
        this.entitieReference = this.selectEntitieReference(this.adminEntity);
        this.action = validUrl[((validUrl.length) - 1)];

        this.possibleEndpoints = {
          GET: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET),
          PUT: this.replacingAdminEndpoints(this.entitieReference.api_reference.PUT),
          GET_BY_ID: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_BY_ID),
          POST: this.replacingAdminEndpoints(this.entitieReference.api_reference.POST),
          GET_MODULES: this.adminEntity === constants.ROUTING_REFERENCES.MULTILENGUAGE ? this.entitieReference.api_reference.GET_MODULES : null,
          GET_TEMPLATE: this.adminEntity === constants.ROUTING_REFERENCES.MASTERS_ROOT ? this.entitieReference.api_reference.GET_TEMPLATE : null,
          UPLOAD_TEMPLATE: this.adminEntity === constants.ROUTING_REFERENCES.MULTILENGUAGE ? this.entitieReference.api_reference.GET_TEMPLATE : null,
          ACTIVATE: this.replacingAdminEndpoints(this.entitieReference.api_reference.ACTIVATE),
          DISACTIVATE: this.replacingAdminEndpoints(this.entitieReference.api_reference.DISACTIVATE)
        }
        this.allowedActions = this.accountService.getAllowedActionsOfEntity(this.adminEntity, this.entitieReference.auth_reference);
        this.breadcrumbIts = this.conformBreadbrumbItems(validUrl, 'admin')
      default:
        break;
    }
  }

  
  conformNewGetIdModulesData(router) {
    this.initializeData();
    let validUrl = router.url.split('/');
    validUrl.splice(0, 1);
    this.urlParams = this.getUrlParams(router);
    this.contextSlug = validUrl[0];
    this.action = validUrl[((validUrl.length) - 1)];
    switch (this.contextSlug) {
      case constants.contextSlug.CONCESSION:
        this.assignUrlParams();
        this.entitieReference = this.selectEntitieReference(!!this.concessionEntity ? this.concessionEntity : this.contextSlug);
        this.possibleEndpoints = {
          GET_DETAIL_BY_ID: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_DETAIL_BY_ID),
          GET_BY_ID: this.replacingConcessionEndpoints(this.entitieReference.api_reference.GET_BY_ID),
          PUT: this.replacingConcessionEndpoints(this.entitieReference.api_reference.PUT),
          POST: this.replacingConcessionEndpoints(this.entitieReference.api_reference.POST),
          DELETE: this.replacingConcessionEndpoints(this.entitieReference.api_reference.DELETE)
        }
        this.allowedActions = this.accountService.getAllowedActionsOfEntity(this.concessionSlug, this.entitieReference.auth_reference);
        this.breadcrumbIts = this.conformBreadbrumbItems(validUrl, 'concession')
        break;
      case constants.contextSlug.ADMIN:
        switch (validUrl[1]) {
          case constants.ROUTING_REFERENCES.MASTERS_ROOT:
            this.entitieReference = this.selectEntitieReference(constants.ROUTING_REFERENCES.MASTERS_ROOT);
            this.entitieReference.routing_additional_parameter = this.urlParams['admin-subentity'];
            this.possibleEndpoints = {
              GET_BY_ID: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_BY_ID),
              PUT: this.replacingAdminEndpoints(this.entitieReference.api_reference.PUT),
              POST: this.replacingAdminEndpoints(this.entitieReference.api_reference.POST),
              GET_TEMPLATE: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_TEMPLATE)
            }
            break;
          case constants.ROUTING_REFERENCES.MULTILENGUAGE:
            this.entitieReference = constants.ENTITY_REFERENCES.MULTILENGUAGE;
            this.possibleEndpoints = {
              GET_MODULES: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_MODULES),
              GET_TEMPLATE: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_TEMPLATE),
              UPLOAD_TEMPLATE: this.replacingAdminEndpoints(this.entitieReference.api_reference.GET_TEMPLATE)
            }
            break;
          default:
            break;
        }
        this.breadcrumbIts = this.conformBreadbrumbItems(validUrl, 'admin')

    }
  }

  replacingConcessionEndpoints(endpoint) {
    if( !!endpoint) {
      let isthereId = endpoint.includes(":id/") || endpoint.substr(-4) === "/:id";
      let istthereIdConcession = endpoint.includes("/:idConcession");
      let changeIdForIdConcession = isthereId && !istthereIdConcession;
      let defEndpoint = endpoint.replace(":idConcession", this.idConcession)
        .replace(":entity", this.urlParams['entity'])
        .replace(":subentity", this.urlParams['subentity'])
        .replace(":id", changeIdForIdConcession? this.idConcession: this.urlParams['id']);
        return defEndpoint;
    }else {
      return null;
    }
      
  }

  replacingAdminEndpoints(endpoint) {
    return !!endpoint ? endpoint.replace(":admin-entity", this.urlParams['admin-entity'])
      .replace(":admin-subentity", this.urlParams['admin-subentity'])
      .replace(":id", this.urlParams['id']) : null;
  }

  getUrlParams(router) {
    let params = {};
    let route = router.routerState.snapshot.root;
    do {
      Object.assign(params, route.params);
      route = route.firstChild;
    } while (route);
    return params;
  }

  assignUrlParams() {
    if (this.isThereParam('idConcession')) {
      this.concessionSlug = this.urlParams['idConcession'];
      this.idConcession = this.accountService.getIdConcession(this.concessionSlug);
    }
    if (this.isThereParam('entity')) this.concessionEntity = this.urlParams['entity'];
    if (this.isThereParam('entity-parent')) this.concessionSubEntity = this.urlParams['entity-parent'];
    if (this.isThereParam('id')) this.idConcessionEntity = this.urlParams['id'];
  }



  selectEntitieReference(concessionEntity) {
    let entityReference = concessionEntity.toUpperCase();
    return constants.ENTITY_REFERENCES[entityReference];
  }

  getEntitieReference() {
    return this.entitieReference;
  }

  isThereParam(key) {
    let propArray = Object.getOwnPropertyNames(this.urlParams)
    return propArray.includes(key);
  }

  isAdminContext() {
    return this.contextSlug === constants.contextSlug.ADMIN;
  }

  isConcessionContext() {
    return this.contextSlug === constants.contextSlug.CONCESSION;
  }









  // conforms the breadcrumb items
  conformBreadbrumbItems(validUrl: string[], tag: string): MenuItem[]{
    let breadcrumb: MenuItem[]=[];
    let addingUrl: string = "";
    switch (tag) {
      case 'concession':
        validUrl.forEach((element, index) => {
          if (element ==="concession") addingUrl += '/concession';
          if( element !=="concession") {
            addingUrl += '/' + element;
            // para lo que salga el nombre de la entidad, modificar aquí
            breadcrumb.push({label:index === 1?this.accountService.getNameConcession(element):element, routerLink: addingUrl});
          }
        });    
        break;
      case 'admin':
        validUrl.forEach((element, index) => {
          if (element ==="concession") addingUrl += '/concession';
          if( element !=="concession") {
            addingUrl += '/' + element;
            // para lo que salga el nombre de la entidad, modificar aquí
            breadcrumb.push({label:index === 1?this.accountService.getNameConcession(element):element, routerLink: addingUrl});
          }
        });    
        break;
    
      default:
        break;
    }
    
    return breadcrumb
  }











  get isMasterModule() {
    let isMasterEntity = false;
    let isAdminEntity = this.isThereParam('admin-entity');
    if (isAdminEntity) isMasterEntity = this.urlParams['admin-entity'] === 'maestros';
    return isMasterEntity
  }

  isThereMastersData() {
    let isthere = this.isThereParam('admin-entity');
    if (isthere) {
      let isMaster = this.urlParams['admin-entity'] === 'maestros';
      return isMaster;
    } else {
      return false;
    }
  }

  // getters de datos de url descontextualizada (admin)
  getMasterData() {
    return this.master;
  }

  getAdditionalRoutingParameter() {
    return !!this.entitieReference?.routing_additional_parameter ? this.entitieReference?.routing_additional_parameter : null;
  }

  getAdminEntity() {
    return this.adminEntity;
  }
  // -------

  // getters de datos de url contextualizada a concesión

  getStaticConcession() {
    return this.staticConcession;
  }

  getCodeConcession() {
    return this.urlParams['concession'];
  }

  getConcessionEntity() {
    return this.urlParams['entity'];
  }

  getIdConcession() {
    return this.idConcession;
  }

  getIdConcessionEntity() {
    return this.idConcessionEntity;
  }

  getIdSubEntity() {
    return this.idSubEntity;
  }

  // -------

  getAction() {
    return this.action;
  }

  getJsonSearchFileName() {
    return this.entitieReference.jsonSearchFileName;
  }

  getJsonViewFileName() {
    return this.entitieReference.jsonViewFileName;
  }

  gerJsonUserFormFileName() {
    return this.entitieReference.jsonUserFormFileName;
  }

  getJsonFormFileName() {
    return this.entitieReference.jsonFormFileName;
  }

  getJsonDeleteFileName() {
    return this.entitieReference.jsonDeleteFileName;
  }

  getAllowedActions() {
    return this.allowedActions;
  }

  getPossibleEndpoints() {
    return this.possibleEndpoints;
  }

  get breadcrumbItems(){
    return this.breadcrumbIts;
  }



}
