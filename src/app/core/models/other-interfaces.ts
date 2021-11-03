
export interface GenericGetResponse<T> {
  pageNumber: number,
  pageSize: number,
  recordsFiltered: number,
  recordsTotal: number,
  succeeded: boolean,
  message: string,
  errors: string[]
  data: T
}


// interfaz de los objetos que se envían por dataTransfer (usado en el módulo de filtros p.e.)

export interface DataTransfer {
  key: string;
  value: any;
}

export interface iNameCheckPermissionsMessage {
  value: string,
  check: boolean
}

// objeto del mensaje del toast
export interface UnauthorizedPermissionMessage {
  codeConcession?: iNameCheckPermissionsMessage,
  codeEntity?: iNameCheckPermissionsMessage
  codeAction?: iNameCheckPermissionsMessage
}

//objeto traductions de las entidades de los maestros
export interface Traductions {
  id: number,
  entidadBaseId: number,
  etiqueta: string,
  idiomaId: number,
  descripcion: string | null
}



// interfaces de objetos de los catálogos que vienen de back 
export interface CatalogData {
  nombre: string;
  valor: any;
}

export interface PageCatalog {
  name: string;
  options: CatalogData[]
}

export interface Catalog {
  name: string;
  isoLang: string;
  options: CatalogData[]
}

// interfaces de selectores

export interface OptionsSelector {
  name: string;
  value: string;
  id?: number;
  link?:string;
}

export interface selectedOption {
  value: string;
}
export interface apiReference {
  GET?: string,
  GET_BY_ID?: string,
  PUT?: string,
  PATCH?: string,
  POST?: string,
  DELETE?: string,
  GET_PERMISSIONS?: string,
  GET_ROLES?: string,
  GET_PREFERENCES?: string,
  ASSOCIATE?: string,
  DISASSOCIATE?: string,
  GET_MODULES?: string
  GET_TEMPLATE?: string
  GET_ERROR_TEMPLATE?: string
  UPLOAD_TEMPLATE?: string,
  POST_TEMPLATE?: string,
  ACTIVATE?: string,
  DISACTIVATE?: string ,
  GET_DETAIL_BY_ID?: string
}



//--------------------------------------------------------------------

// Interfaces para estructura referencias sea api o auth o nombre de archivos... de las entidades

export interface entityConfigData {
  auth_reference: string,
  api_reference: apiReference,
  routing_reference: string,
  routing_additional_parameter?: string,
  jsonModalFileName?: string,
  jsonSearchFileName?: string,
  jsonViewFileName?: string,
  jsonFormFileName?: string,
  jsonUserFormFileName?: string,
  jsonDeleteFileName?: string,
  jsonUploadFileName?: string,
  jsonModulesFileName?: string,
  icon_links?: string
}


//--------------------------------------------------------------------

// Interfaces para estructura de formularios  del objeto json que llega

export interface validations {
  required?: string,
  maxLength?: number,
  minLength?: number,
  max?: number,
  min?: number
}

export interface searchAreas {
  id: string,
  class?: string,
  label: string,
  tag: string,
  data?: CatalogData[],
  customTemplate?: boolean,
  customTraduction?: boolean,
  type?: string,
  validations?: validations,
  hidden?: boolean
}

export interface buttons {
  cancelButton?: boolean,
  addButton?: boolean,
  submitButton?: boolean,
  hisoricButton?: boolean,
  deleteButton?: boolean,
  searchButton?: boolean,
  cleanButton?: boolean,
  backButton?: boolean,
  filterButton?: boolean,
  editButton?: boolean,
  associateButton?: boolean,
  desassociateButton?: boolean,
  uploadButton?: boolean,
  activateButton?: boolean,
  desactivateButton?: boolean,
  createButton?: boolean
}

export interface jsonFormsData {
  title: string,
  section?: string,
  class: string,
  area: searchAreas[],
  createButtons: buttons
  formButtons: buttons
  searchButtons: buttons
}

//--------------------------------------------------------------------
// Interfaces para estructura de formularios  del objeto json que llega

export interface dataFields {
  DTO: string,
  LABEL: string,
  catalog?: string,
  render?: string
}

export interface jsonViewData {
  title?: string
  area?: searchAreas[],
  filterButtons?: buttons,
  table: {
    ownTableFilter?: boolean,
    ownTableSort?: boolean,
    pageSize?: number[],
    pageNumber?: number,
    dataFields: dataFields[],
    rowButtons?: buttons,
    tableButtons?: buttons,
    isModal?: boolean,
    configure_columns?: boolean,

  }
}

// Interfaces para la tabla search

export interface column {
  field: any,
  header: string,
  filter?: string,
  sortable?: string,
  filterMatchMode?: string,
  tag?: string
}

export interface iColumnsConfig {
  column: string,
  visibility: boolean
}


export interface iConvertSubAreaObject {
  id: string,
  class: string,
  label: string,
  tag: string,
  type: string,
  placeholder: string,
  disabled: boolean,
}

export interface iConvertAreaObject {
  title: string,
  class: string,
  subArea: iConvertSubAreaObject[]
}
export interface iConvertObject {
  title: string,
  section: string,
  class: string,
  area: iConvertAreaObject[],
  buttons: buttons
}