import { environment } from "src/environments/environment";

//ruta absoluta para el archivo de constantes
export const ROOT_JSON_CONFIG_DIR= "assets/json/config/";

export const  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const LANGUAGE = ['NEWTRAL', 'ES', 'CA']

export enum contextSlug {
    ADMIN = 'admin',
    CONCESSION = "concession",
    DASHBOARD = "home"
}

// REFERENCIAS REFERENCIAS DE NOMBRE DE ARCHIVOS DE LAS ENTIDADES------------------------------
export enum JSON_FILE_NAME {
    CONCILIATIONS = "conciliations",
    PAYMENTS = "payments",
    COLLECTIONS = "collections",
    FACTURA = "bills",
    PRODUCTO = "products",
    LECTURA = "lecturas",
    PRESUPUESTO = "presupuesto",
    ACCOUNT = "account",
    ACCOUNT_GENERAL = "account-general",
    ACCOUNT_FORMAT = "account-format",
    ACCOUNT_PERMISSIONS = "account-permissions",
    AJUSTES_CONCESION = "concession-setting",
    ZONA = "zone",
    ROLS = "rols",
    MULTI_LANGUAGE = "multi-language",
    MASTERS = "maestros",
    PROCESSES = "procesos",
    USUARIOS = "user",
    NOTIFICACIONES_NO_CERT = "notificaciones-no-certificadas",
    NOTIFICACIONES_CERTIFIACADAS = "notificaciones-certificadas"
}
// ------------------------------

// REFERENCIAS DE PERMISOS DE LAS ENTIDADES------------------------------

export enum AUTH_REFERENCES {
    LECTURA = "lectura",
    ACCOUNT ="account",
    CONCESION= "concesion",
    GLOBAL = "global",
    USUARIOS = "account",
    NOTIFICACIONES = "notificaciones"
}
// REFERENCIAS DE PERMISOS DE LAS ENTIDADES------------------------------

export enum ROUTING_PARAMETERS_REFERENCES {
    CONCESION = ":idConcession",
    ENTITY = ":entity",
    SUBENTITY = ":subentity",
    ID_REGISTER = ":id",
    ADMIN_ENTITY = ":admin-entity",
    ADMIN_SUBENTITY = ":admin-subentity",
    ENTITYPARENT = ":entity-parent",
    
}

// ------------------------------

// REFERENCIAS DE RUTA DE LAS ENTIDADES------------------------------

export enum ROUTING_MASTER_REFERENCES {
    ESTADO_LECTURAS = "estadolecturas",
    DIVISAS = "divisas",
    TIPO_REMESAS = "tiporemesa",
    TIPO_NOTIFICACIONES = "tiponotificacion"

}

export enum ROUTING_PROCESSES_REFERENCES {
    PROCESSES_EXECUTION = "ejecucion-procesos"
}

export enum ROUTING_NOTIFICATIONS_REFERENCES {
    CERTIFICATE = "certificadas",
    NON_CERTIFICATE = "no-certificadas"

}

export enum ROUTING_REFERENCES {
    LECTURA = "lecturas",
    ACCOUNT = "account",
    AJUSTES_CONCESION = "edit",
    ROLS = "rols",
    ZONA = "zonas",
    USUARIOS = "usuarios",
    CONCILIATIONS ="pagos-cobros",
    MULTILENGUAGE = "multilenguage",
    MASTERS_ROOT = "maestros",
    HOME = "home",
    PROCESSES_ROOT = "gestor-procesos",
    CONCESSION = "concession",
    NOTIFICACIONES_ROOT = "notificaciones"

}

export const ROUTING_CONCESSION_BASE = "/" + ROUTING_REFERENCES.CONCESSION + "/" + ROUTING_PARAMETERS_REFERENCES.CONCESION + "/";

export const ROUTING_USER_BASE = ROUTING_REFERENCES.ACCOUNT + "/" + ROUTING_PARAMETERS_REFERENCES.ID_REGISTER;

export enum MASTERS_ROUTING_REFERENCES {
    ESTADO_LECTURAS = ROUTING_REFERENCES.MASTERS_ROOT +"/" + ROUTING_MASTER_REFERENCES.ESTADO_LECTURAS,
    DIVISAS = ROUTING_REFERENCES.MASTERS_ROOT +"/" + ROUTING_MASTER_REFERENCES.DIVISAS,
    TIPO_NOTIFICACIONES = ROUTING_REFERENCES.MASTERS_ROOT +"/" + ROUTING_MASTER_REFERENCES.TIPO_NOTIFICACIONES,
    TIPO_REMESAS = ROUTING_REFERENCES.MASTERS_ROOT +"/" + ROUTING_MASTER_REFERENCES.TIPO_REMESAS
}

export enum PROCESSES_ROUTING_REFERENCES {
    EXECUTION_PROCESSES = ROUTING_REFERENCES.PROCESSES_ROOT + "/" + ROUTING_PROCESSES_REFERENCES.PROCESSES_EXECUTION,
    USUARIOS =  ROUTING_REFERENCES.USUARIOS
}

export enum NOTIFICATIONS_ROUTING_REFERENCES {
    CERTIFICATE = ROUTING_REFERENCES.NOTIFICACIONES_ROOT + "/" + ROUTING_NOTIFICATIONS_REFERENCES.CERTIFICATE,
    NON_CERTIFICATE = ROUTING_REFERENCES.NOTIFICACIONES_ROOT + "/" + ROUTING_NOTIFICATIONS_REFERENCES.NON_CERTIFICATE,
}



// ------------------------------

export enum mastersTraduction {
    estadolecturas = "GENERAL.ENTITIES.MASTERS.ESTADO_LECTURAS",
    divisas = "GENERAL.ENTITIES.MASTERS.DIVISAS",
}

export enum Actions  {
    CREATE = "create",
    EDIT = "edit",
    DETAIL = "detail",
    AUDIT = "historic",
    FILTER = "filter",
    DELETE = "delete",

}

export enum SESSION_STORAGE_LABELS {
 ALL_CATALOGS = "globalCatalogs",
 ALL_PERMISSIONS = "globalPermissions",
 COLLECTIONS = "collections-filter",
 PAYMENTS = "payments-filter"
}

export enum FILES  {
    FORMS = "forms",
    SEARCH = 'search',
    VIEW =  'view',
    DELETE = "delete",
    MODAL = "modal"
}

export const rootFormsDir: string = "assets/json/config/";

export enum severityToast {
    SUCCESS = "success",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}


export enum LANGUAGES {
    SPANISH = "es",
    CATALAN = "ca"
}



// REFERENCIAS DE ICONOS DE LAS ENTIDADES ------------------------------
export enum ICON_LINKS {
    LECTURA = "pi pi-book",
    PRODUCTO = "pi pi-th-large",
    FACTURA = "pi pi-money-bill",
    PRESUPUESTO = "pi pi-file-o",
    ACCOUNT = "pi pi-user-edit",
    AJUSTES_CONCESION = "pi pi-file-o",
    ROLS = "pi pi-user",
    ZONA = "pi pi-file-o",
    USUARIOS = "pi pi-file-o",
    NOTIFICACIONES = "pi pi-file-o",
    NOTIFICACIONES_CERTIFICADAS = "pi pi-file-o"
}
// ------------------------------

export const apiEntities = {
    concession_settings : ['concesiones', 'zonas'],
    account : ['permisos','usuarios', 'preferencias'],
    lecturas: ['lecturas'],
    notifcaciones: ['notificaciones']
}

// **************************
// ENTIDADES
// **************************
export const ENTITY_REFERENCES = {
    ACCOUNT: {
        auth_reference: AUTH_REFERENCES.GLOBAL,
        api_reference: {
            GET: environment.endpoints.userPreferences,
            PUT: environment.endpoints.userPreferences,
            POST: null,
            GET_BY_ID: null
        },
        routing_reference: ROUTING_USER_BASE + ROUTING_REFERENCES.ACCOUNT,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + ROUTING_REFERENCES.ACCOUNT + "/" + ROUTING_REFERENCES.ACCOUNT + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + ROUTING_REFERENCES.ACCOUNT + "/" + ROUTING_REFERENCES.ACCOUNT + "_" + FILES.VIEW + ".json",
        jsonUserFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ACCOUNT + "/" + JSON_FILE_NAME.ACCOUNT_FORMAT + "_" + FILES.FORMS + ".json",
        jsonUserDeleteFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ACCOUNT + "/" + JSON_FILE_NAME.ACCOUNT_FORMAT + "_" + FILES.FORMS + ".json",
        icon_links: ICON_LINKS.ACCOUNT
    },
    LECTURAS: {
        auth_reference: AUTH_REFERENCES.LECTURA,
        api_reference: {
            GET: environment.endpoints.readings,
            GET_BY_ID: environment.endpoints.readingsById,
            PUT: environment.endpoints.readings,
            POST: environment.endpoints.readings,
            DELETE: environment.endpoints.readings
        },
        routing_reference: ROUTING_REFERENCES.LECTURA,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.LECTURA + "/" + JSON_FILE_NAME.LECTURA + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.LECTURA + "/" + JSON_FILE_NAME.LECTURA + "_" + FILES.VIEW + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.LECTURA + "/" + JSON_FILE_NAME.LECTURA + "_" + FILES.FORMS + ".json",
        jsonDeleteFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.LECTURA + "/" + JSON_FILE_NAME.LECTURA + "_" + FILES.DELETE    + ".json",
        icon_links: ICON_LINKS.LECTURA
    },
    CONCESSION: {
        auth_reference: AUTH_REFERENCES.CONCESION,
        api_reference: {
            GET: environment.endpoints.concession,
            GET_BY_ID: environment.endpoints.concessionById,
            PUT: environment.endpoints.concession,
            POST: environment.endpoints.concession,
            DELETE: environment.endpoints.concession
        },
        routing_reference: ROUTING_REFERENCES.AJUSTES_CONCESION,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.AJUSTES_CONCESION + "/" + JSON_FILE_NAME.AJUSTES_CONCESION + "_" + FILES.SEARCH + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.AJUSTES_CONCESION + "/" + JSON_FILE_NAME.AJUSTES_CONCESION + "_" + FILES.FORMS + ".json",
        icon_links: ICON_LINKS.AJUSTES_CONCESION
    },
    ROLS: {
        auth_reference: AUTH_REFERENCES.GLOBAL,
        api_reference: {
            GET: environment.endpoints.rols,
            GET_PERMISSIONS: environment.endpoints.permissions,
            GET_BY_ID: environment.endpoints.rolById,
            PUT: environment.endpoints.rols,
            POST: environment.endpoints.rols,
            DELETE: environment.endpoints.rols
        },
        routing_reference: ROUTING_REFERENCES.ROLS,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ROLS + "/" + JSON_FILE_NAME.ROLS + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ROLS + "/" + JSON_FILE_NAME.ROLS + "_" + FILES.VIEW + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ROLS + "/" + JSON_FILE_NAME.ROLS + "_" + FILES.FORMS + ".json",
        jsonDeleteFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ROLS + "/" + JSON_FILE_NAME.ROLS + "_" + FILES.DELETE    + ".json",
        icon_links: ICON_LINKS.ROLS
    },
    ZONAS: {
        auth_reference: AUTH_REFERENCES.CONCESION,
        api_reference: {
            GET: environment.endpoints.zone,
            GET_BY_ID: environment.endpoints.zoneById, 
            PUT: environment.endpoints.zone,
            POST: environment.endpoints.zone,
            DELETE: environment.endpoints.zone,
            ASSOCIATE: environment.endpoints.associateZone,
            DISASSOCIATE: environment.endpoints.disassociateZone,
        },
        routing_reference: ROUTING_REFERENCES.ZONA,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ZONA + "/" + JSON_FILE_NAME.ZONA + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ZONA + "/" + JSON_FILE_NAME.ZONA + "_" + FILES.VIEW + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ZONA + "/" + JSON_FILE_NAME.ZONA + "_" + FILES.FORMS + ".json",
        jsonDeleteFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.ZONA + "/" + JSON_FILE_NAME.ZONA + "_" + FILES.DELETE    + ".json",
        icon_links: ICON_LINKS.ZONA
    },

    USUARIOS: {
        auth_reference: AUTH_REFERENCES.USUARIOS,
        api_reference: {
            GET: environment.endpoints.concesionUsers,
            GET_BY_ID: environment.endpoints.userById, 
            PUT: environment.endpoints.userPreferences,
            POST: environment.endpoints.concesionUsers,
            DELETE: environment.endpoints.concesionUsers,
            GET_ROLES: environment.endpoints.rols,
            GET_PREFERENCES: environment.endpoints.userPreferences
        },
        routing_reference: ROUTING_REFERENCES.USUARIOS,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.USUARIOS + "/" + JSON_FILE_NAME.USUARIOS + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.USUARIOS + "/" + JSON_FILE_NAME.USUARIOS + "_" + FILES.VIEW + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.USUARIOS + "/" + JSON_FILE_NAME.USUARIOS + "_" + FILES.FORMS + ".json",
        jsonDeleteFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.USUARIOS + "/" + JSON_FILE_NAME.USUARIOS+ "_" + FILES.DELETE    + ".json",
        icon_links: ICON_LINKS.USUARIOS
    },
    MULTILENGUAGE: {
        auth_reference: AUTH_REFERENCES.GLOBAL,
        api_reference: {
            GET: null,
            POST: null,
            PUT: null,
            GET_BY_ID: null,
            GET_MODULES: environment.endpoints.multilanguage,
            GET_TEMPLATE: environment.endpoints.multilanguageTemplate, 
            GET_ERROR_TEMPLATE: environment.endpoints.multilanguageErrorTemplate, 
            POST_TEMPLATE: environment.endpoints.multilanguage
        },
        routing_reference: ROUTING_REFERENCES.MULTILENGUAGE,
        jsonModulesFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.MULTI_LANGUAGE  + "/modules.json",
        jsonUploadFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.MULTI_LANGUAGE + "/upload.json"
    },
    MAESTROS: {
        auth_reference: AUTH_REFERENCES.GLOBAL,
        api_reference: {
            GET: environment.endpoints.masters, 
            GET_BY_ID : environment.endpoints.entityMasterById, 
            POST: environment.endpoints.masterPost,
            GET_TEMPLATE: environment.endpoints.templateMaster,
            PUT: environment.endpoints.masterPost,
            ACTIVATE: environment.endpoints.masterActivate,
            DISACTIVATE: environment.endpoints.masterDisactivate
        },
        routing_reference: ROUTING_REFERENCES.MASTERS_ROOT,
        routing_additional_parameter: '',
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.MASTERS  + "/"+JSON_FILE_NAME.MASTERS + "_" + FILES.SEARCH + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.MASTERS + "/" + JSON_FILE_NAME.MASTERS + "_forms.json"
        // icon_links: ICON_LINKS.USUARIOS
    },
    "EJECUCION-PROCESOS": {
        auth_reference: AUTH_REFERENCES.GLOBAL,
        api_reference: {
            GET: environment.endpoints.procesos,
            GET_BY_ID : environment.endpoints.procesosById,
        },
        routing_reference: PROCESSES_ROUTING_REFERENCES.EXECUTION_PROCESSES,
        routing_additional_parameter: '',
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.PROCESSES  + "/" + JSON_FILE_NAME.PROCESSES + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.PROCESSES + "/" + JSON_FILE_NAME.PROCESSES + "_" + FILES.VIEW + ".json",
        jsonFormFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.PROCESSES + "/" + JSON_FILE_NAME.PROCESSES + "_forms.json"
    },
    "NO-CERTIFICADAS": {
        auth_reference: AUTH_REFERENCES.NOTIFICACIONES,
        api_reference: {
            GET: environment.endpoints.notificacionesNoCertificadas,
            GET_BY_ID: environment.endpoints.notificacionesNoCertificadasById
        },
        routing_reference: NOTIFICATIONS_ROUTING_REFERENCES.NON_CERTIFICATE,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.NOTIFICACIONES_NO_CERT + "/" + JSON_FILE_NAME.NOTIFICACIONES_NO_CERT + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.NOTIFICACIONES_NO_CERT + "/" + JSON_FILE_NAME.NOTIFICACIONES_NO_CERT + "_" + FILES.VIEW + ".json",
        jsonModalFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.NOTIFICACIONES_NO_CERT + "/" + JSON_FILE_NAME.NOTIFICACIONES_NO_CERT + "_" + FILES.MODAL + ".json"
    },
    CERTIFICADAS: {
        auth_reference: AUTH_REFERENCES.NOTIFICACIONES,
        api_reference: {
            GET: environment.endpoints.notificacionesCertificadas,
            GET_BY_ID: environment.endpoints.notificacionesCertificadasById
        },
        routing_reference: NOTIFICATIONS_ROUTING_REFERENCES.CERTIFICATE,
        jsonSearchFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.NOTIFICACIONES_CERTIFIACADAS + "/" + JSON_FILE_NAME.NOTIFICACIONES_CERTIFIACADAS + "_" + FILES.SEARCH + ".json",
        jsonViewFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.NOTIFICACIONES_CERTIFIACADAS + "/" + JSON_FILE_NAME.NOTIFICACIONES_CERTIFIACADAS + "_" + FILES.VIEW + ".json",
        jsonModalFileName: ROOT_JSON_CONFIG_DIR + JSON_FILE_NAME.NOTIFICACIONES_CERTIFIACADAS + "/" + JSON_FILE_NAME.NOTIFICACIONES_CERTIFIACADAS + "_" + FILES.MODAL + ".json"
    }
}


// ***********************************************************************************************************************
// ***********************************************************************************************************************


export const HEADER_LINKS = [
    { authEntitie: ENTITY_REFERENCES.LECTURAS.auth_reference, traduction: "GENERAL.MENU.BILLING.READINGS", icon: ENTITY_REFERENCES.LECTURAS.icon_links , route: ROUTING_CONCESSION_BASE + ENTITY_REFERENCES.LECTURAS.routing_reference }
  ]

export const loginOidUrl = `${environment.authUrl}/Identity/Account/login`

// valores de paginación y tamaño de registros de la tabla
export const tablePageSize = [10, 20, 30];
export const tablePageNumber = 1;

// valor de sort por defecto de la tabla
export const tableDefaultSort = "id descending"
