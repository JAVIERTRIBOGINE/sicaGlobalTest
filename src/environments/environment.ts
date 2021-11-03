// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const api = {
  account: "/accounts/",
  concession_settings: "/concesiones/",
  concession: "/concesion/",
  lecturas: "/lecturas/",
  global: "/global"
}

export const environment = {
  production: false,
  authUrl: "https://ddd-identity.azurewebsites.net",
  urlBase: '/api/v1',
  urlRedirect: 'http://localhost:4200',
  endpoints: {
    //lecturas
    readings: api.lecturas + "concesion/:idConcession/lecturas",
    readingsById: api.lecturas + "concesion/:idConcession/lecturas/:id",
    //usuarios
    users: api.account + "usuarios",
    userById: api.account + "usuarios/:id",
    userPreferences: api.account + "usuarios/:id/preferencias",
    userConcession: api.concession_settings + "concesion/:idConcession/usuarios",
    concesionUsers: api.account + "concesiones/:idConcession/usuarios",
    concesionUserById: api.account + "concesiones/:idConcession/usuarios/:id",
    // concesiones
    concession: api.concession_settings + "concesiones",
    concessionById: api.concession_settings + "concesiones/:id",
    //zonas
    zone: api.concession_settings + "concesiones/:idConcession/zonas",
    zoneById: api.concession_settings + "concesiones/:idConcession/zonas/:id",
    associateZone: api.concession_settings + "concesiones/:idConcession/zonas/asociar",
    disassociateZone: api.concession_settings + "concesiones/:idConcession/zonas/desasociar",
    //roles y permisos
    permissions: api.account + "permisos",
    rols: api.account + "concesiones/:idConcession/roles",
    rolById: api.account + "concesiones/:idConcession/roles/:id",
    //histórico
    historics: "/historico",
    //maestros
    mastersData: api.global + "/maestros-genericos/listado",
    masters: api.global + "/maestros-genericos/listado-completo",
    entityMasterById: api.global + "/maestros-genericos/entidad",
    templateMaster: api.global + "/maestros-genericos/plantilla",
    masterPost: api.global + "/maestros-genericos",
    masterActivate: api.global + "/maestros-genericos/active",
    masterDisactivate: api.global + "/maestros-genericos",
    //multilenguage
    multilanguage: api.global + "/modulos-traduccion",
    multilanguageTemplate: api.global + "/modulos-traduccion/plantilla",
    multilanguageErrorTemplate: api.global + "/modulos-traduccion/errores",
    //procesos
    procesos: api.global  + "/concesion/:idConcession/gestor-procesos/ejecucion-procesos",
    procesosById: api.global + "/concesion/:idConcession/gestor-procesos/ejecucion-proceso/:id",
    //notificaciones
    notificacionesNoCertificadas: api.global  + "/concesion/:idConcession/notificaciones/no-certificadas",
    notificacionesNoCertificadasById: api.global  + "/concesion/:idConcession/notificaciones/no-certificadas/:id",
    notificacionesCertificadas: api.global  + "/concesion/:idConcession/notificaciones/certificadas",
    notificacionesCertificadasById: api.global  + "/concesion/:idConcession/notificaciones/certificadas/:id",
  },
  masterEndpoints: {
    estadolecturas: api.lecturas + "/estado-lectura",
    idiomas: api.global + "/idiomas",
    punctuation: api.global + "/puntuacion",
    fechahora: api.global + "/fechahora"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
