import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { Subscription, Observable } from 'rxjs';
import { DataTransfer } from 'src/app/core/models/other-interfaces';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { AccountService } from 'src/app/core/services/account.service';
import { RenderService } from 'src/app/core/services/renderService';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ModalFormsNgComponent } from '../modalFormsNg/modalFormsNg.component';
import { RouterService } from 'src/app/core/services/router.servcice';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { SimpleContainerModalComponent } from '../simple-container-modal/simple-container-modal.component';



@Component({
  selector: 'sica-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [DialogService, MessageService, DynamicDialogRef, TranslateService]
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @ViewChild("dt", { static: false }) primeTable: Table;
  @ViewChild("toolkit", { static: false }) toolkit: MultiSelect;
  @Input() data;
  @Input() title;
  @Input() columns: INTERFACES.column[];
  @Input() selectedName;
  @Input() multipleRecords = false;
  @Input() dto_multipleRecords = "";
  @Input() searchAreas = [];
  @Input() dataFields = [];
  @Input() hideExternalSearch = false;
  @Input() historic: boolean = true;
  @Input() view: boolean = true;
  @Input() allowedActions = [];
  @Input() tableButtons;
  // se recibe este valor para permitir el lazy load
  @Input() pageNumber;

  // se recibe este valor para permitir el lazy load
  @Input() rows;

  @Input() pageSize;

  @Input() _selectedColumns: INTERFACES.column[];

  @Input() entity;
  @Input() codeConcession;
  @Input() endpoints;
  // se reciben el numero total de registros para permitir el lazy load
  @Input() totalRecords;
  @Input() originalData;
  @Input() isModal;
  loading: boolean = false;
  selectedRow: any[] = [];
  searchForm: FormGroup;
  filteredData: DataTransfer[];

  //subscripciones
  subsTransfer$: Subscription = new Subscription();
  subsRouting$: Subscription = new Subscription();

  dataTransfer$: Observable<DataTransfer[]>;
  filtered: boolean = false;
  items: MenuItem[] = [];
  buttonsSelectedRow: any;
  filteredColumns: string[] = [];
  showFilter: boolean = false;

  @ViewChild("opTwo", { static: false }) overlay: OverlayPanelModule;
  @ViewChild("multiSselect", { static: false }) multiselect: ElementRef<HTMLElement>;

  @Output() updateRows: EventEmitter<any[]> = new EventEmitter<any>();
  @Output() lazyData: EventEmitter<any> = new EventEmitter<any>();
  @Output() export: EventEmitter<string> = new EventEmitter<string>();
  @Output() onAsociate: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() onDisasociate: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() onActivate: EventEmitter<object> = new EventEmitter<object>();
  @Output() onDisactivate: EventEmitter<object> = new EventEmitter<object>();
  @Output() onMultipleDelete: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  filledOnce: boolean = false;


  columnsConfig: INTERFACES.iColumnsConfig[] = [];
  assocAction: string = '';
  currentAssocAction: boolean;
  currentActiveAction: boolean;
  draggingIndex: number;

  constructor(
    public messageService: MessageService,
    private router: Router,
    public dataTransferService: DataTransferService,
    public dictionaryService: DictionaryService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public accountService: AccountService,
    public renderService: RenderService,
    public dialogService: DialogService,
    public dialogRef: DynamicDialogRef,
    public routerService: RouterService,
    public customMessageService: CustomMessageService,
    public route: ActivatedRoute
  ) {
    this.dataTransfer$ = this.dataTransferService.matchFilterTransfer();
    this.subsTransfer$ = this.dataTransfer$.subscribe((data: DataTransfer[]) => {
      if (this.columns?.length !== 0) {
        this.filteredData = data;

        if (!!this.primeTable) {
          this.filteringTableData(data);
        }
      }
    });
    this.subsRouting$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedRow = []
      }
    });


  }
  ngOnChanges(changes: SimpleChanges): void { 
    if (changes.columns && !changes.columns.firstChange) {
      this.filteredColumns = this.columns.map((column) => column.field);
      this.columnsConfig = this.columns.map(_column => { return { column: _column.field, visibility: true } });
    }
  }

  ngOnInit(): void {


    /**
     * definición y configuración de los botones crud de los registro
     */
    this.defineActions();

  }


  /**
   * filtra los datos de la table con el objeto 'dataToFilter'
   * @param dataToFilter datos que recibe el componente de la tabla para que sea filtrado
   */
  filteringTableData(dataToFilter) {
    dataToFilter.forEach(element => {
      if (typeof (element.value) !== "string") this.primeTable.filter(element.value, element.key, 'in');
      else this.primeTable.filter(element.value, element.key, 'contains');
    });
  }

  /**
   * método que se llama en el LayLoad del table
   * @param event evento del lazyLoad
   */
  loadData(event) {
    this.lazyData.next(event);
  }

  exportData(format) {
    this.export.next(format);
  }



  /**
   * se activa al dispararse evento click del boton de registro
   * elimina el registro de tabla interna de formulario multiregistro
   * @param rowData datos del registro a eliminar
   * @param rowIndex posición en el array de objetos de datos de la tabla interna
   */
  clean(rowData, rowIndex) {
    this.data = this.data.filter(row => this.data.indexOf(row) !== rowIndex);
    this.updateRows.emit(this.data);
  }

  saveReorderedColumns(event: any) {
    this.columns = event.columns; // <-- important
    this.getSelectedColumns();
  }

  /**
   * se llama al dispararse evento click del boton de edición de cada registro.
   *
   * @param rowData son los datos de la fila de referencia
   */
  public editRow(rowData: object) {
    let definiteRoute = '/concession/' + this.codeConcession + '/' + this.entity + '/' + rowData['id'] + '/' + constants.Actions.EDIT;
    this.router.navigate([definiteRoute]);
  }

  /**
   * enruta a pantalla de históricos
   * @param rowData datos de registro
   */
  public auditRow(rowData: object) {
    let definiteRoute = '/concession/' + this.codeConcession + '/' + this.entity + '/' + rowData['id'] + '/' + constants.Actions.AUDIT;
    this.router.navigate([definiteRoute]);
  }

  /**
   * enruta a pantalla de detalle
   * @param rowData datos de registro seleccionado
   */
  public viewRow(rowData: object) {
    let definiteRoute = '';

    this.router.navigate(["./" + rowData['id'] + "/" + constants.Actions.DETAIL], { relativeTo: this.route });
  }

  /**
   * enruta a pantalla delete
   * @param rowData datos de registro seleccionado
   */
  public deleteRow(rowData: object) {

    let definiteRoute = '/concession/' + this.codeConcession + '/' + this.entity + '/' + rowData['id'] + '/' + constants.Actions.DELETE;
    this.router.navigate([definiteRoute]);
  }

  /**
   * Cuando se visualicen las acciones agrupadas, da datos y comando a ejecutar en cada boton crud
   */
  defineActions() {
    this.items = [
      {
        label: this.translate.instant("GENERAL.ALERTS.BUTTON_VIEW"), icon: 'pi pi-eye', command: () => {
          this.viewRow(this.buttonsSelectedRow)
        }
      },
      {
        label: this.translate.instant("GENERAL.ALERTS.BUTTON_HISTORIC"), icon: 'pi pi-replay', command: () => {
          this.auditRow(this.buttonsSelectedRow);
        }
      },
      {
        label: this.translate.instant("GENERAL.ALERTS.BUTTON_EDIT"), icon: 'pi pi-eye', command: () => {
          this.editRow(this.buttonsSelectedRow);
        }
      },
      {
        label: this.translate.instant("GENERAL.ALERTS.BUTTON_DELETE"), icon: 'pi pi-trash', command: () => {
          this.deleteRow(this.buttonsSelectedRow);
        }
      }
    ];
  }



  asociate(event, ok) {
    let values = this.selectedRow.reduce((a, b) => a.concat(b.id), []);
    switch (ok) {
      case true:
        this.onAsociate.next(values);
        break;
      default:
        this.onDisasociate.next(values)
        break;
    }
  }

  activate(event, ok) {
    let activateValues = { maestro: this.routerService.urlParams['admin-subentity'], entidadId: this.selectedRow[0].id }
    switch (ok) {
      case true:
        this.onActivate.next(activateValues);
        break;
      default:
        this.onDisactivate.next(activateValues)
        break;
    }
  }



  /**
   * guarda los datos del registro seleccionado en una variable global
   * @param row datos del registro seleccionado
   */
  keepRowData(row) {
    this.buttonsSelectedRow = row;
  }

  multipleDelete(event) {
    let values = this.selectedRow.reduce((a, b) => a.concat(b.id), []);
    this.onMultipleDelete.next(values)
  }

  onSelect(event) {

    switch (this.routerService.isMasterModule) {
      case true:
        if (this.selectedRow.length === 1) this.currentActiveAction = event.data.activo;
        else if (this.primeTable.selection.length > 1) this.primeTable.selection.pop();
        break;

      default:
        if (this.selectedRow.length === 1) this.currentAssocAction = event.data.asociada;
        else if (this.selectedRow.length > 1) {
          this.selectedRow = this.selectedRow.filter(selected => selected.asociada === this.currentAssocAction);
          this.primeTable.selection = this.selectedRow;
        }
        break;
    }

  }


  /**se llama para visualizar las columnas filtradas por el selector de columnas */
  getSelectedColumns() {
    let sortingArr: string[];
    if (this.columnsConfig.length !== 0) {
      sortingArr = this.columnsConfig.map(test => test.column);
      this._selectedColumns = this.columns.filter(val => this.evaluateVal(val))
      this._selectedColumns.sort(function (a, b) {
        return sortingArr.indexOf(a.field) - sortingArr.indexOf(b.field);
      });

      return this._selectedColumns;
    } else {
      return this.columns.filter(val => (this.filteredColumns.includes(val.field)));
    }

  }

  evaluateVal(val) {
    return this.columnsConfig.find(test => test.column === val.field).visibility;
  }

  onDragStart(fromIndex) {
    this.draggingIndex = fromIndex;
  }
  onDragEnter(toIndex) {
    if (this.draggingIndex !== toIndex) {
      this._reorderItem(this.draggingIndex, toIndex);
    }
  }
  onDragEnd() {
    this.draggingIndex = undefined;
  }

  editModalForm(rowData, entity) {
      let referenceEntity = this.routerService.urlParams['entity'];
     
   switch (referenceEntity) {
     case constants.ROUTING_NOTIFICATIONS_REFERENCES.NON_CERTIFICATE:
      this.dialogRef = this.dialogService.open(SimpleContainerModalComponent, {
    
        header: 'CUERPO DEL MENSAJE:',
        width: '70%',
        data: {
          body: rowData['cuerpo'],
          flag: "non-certificate-modal"
        }
      });
       
      break;

      case constants.ROUTING_NOTIFICATIONS_REFERENCES.CERTIFICATE:
      this.dialogRef = this.dialogService.open(SimpleContainerModalComponent, {
    
        header: 'NÚMERO DE DOCUMENTO:',
        width: '70%',
        data: {
          body: rowData['documento'],
          flag: "certificate-modal"
        }
      });
       
      break;
   
     default:
      this.dialogRef = this.dialogService.open(ModalFormsNgComponent, {
        header:  entity,
        width: '70%',
        data: {
          entity: entity,
          master: entity === 'maestros' ? this.routerService.getMasterData() : null,
          jsonFile: this.manageJsonFileSelection(entity),
          rowdata: rowData,
          action: constants.Actions.EDIT,
          endpoint: {
            put: !!this.routerService.getPossibleEndpoints()['PUT'] ? this.routerService.getPossibleEndpoints()['PUT'] : null,
            post: !!this.routerService.getPossibleEndpoints()['POST'] ? this.routerService.getPossibleEndpoints()['POST'] : null
          }
        }
      });
       break;
   }
  
    this.dialogRef.onClose.subscribe((check: boolean) => {
      this.onCloseModal.next(true)
    })
  }

  manageJsonFileSelection(entity){
    let jsonFile = entity === constants.ROUTING_REFERENCES.NOTIFICACIONES_ROOT? this.routerService.entitieReference.jsonModalFileName
    : this.routerService.entitieReference.jsonFormFileName;
    return jsonFile;
  }
  private _reorderItem(fromIndex: number, toIndex: number): void {
    let auxObj: INTERFACES.iColumnsConfig;
    auxObj = this.columnsConfig.splice(fromIndex, 1)[0];
    this.columnsConfig.splice(toIndex, 0, auxObj);
    this.draggingIndex = toIndex;
  }

  /**
   * evalúa si se han cargado los datos json de la estructura del formulario de filtros
   */
  get showColumnFilter() {
    return this.showFilter;
  }

  /**
 * evalúa si se han cargado los datos json de la estructura del formulario de filtros
 */
  get loadedSearchAreas() {
    return this.searchAreas.length !== 0;
  }

  /**evalúa si se han cargado los datos de la tabla */
  get isData() {
    return this.data.length !== 0;
  }

  get disabledAssociate() {
    return this.selectedRow.length === 0 || this.currentAssocAction;
  }

  get disabledDisassociate() {
    return this.selectedRow.length === 0 || !this.currentAssocAction;
  }

  get disabledActivate() {
    return this.selectedRow.length === 0 || this.currentActiveAction;
  }

  get disabledDisactivate() {
    return this.selectedRow.length === 0 || !this.currentActiveAction;
  }

  get isZone() {
    return this.entity === 'zonas';
  }

  get isEntityToModal(){
    return this.isModal;
  }

  /**
   * evalua si la acción pasada por parámetro está incluída en las acciones permitidas para
   * ese usuario y esa concesión
   * @param action acción CRUD ('create-delete-read-edit')
   * @returns
   */
  public getGrantAction(action) {
    return this.allowedActions.includes(action);
  }

  public linking(link) {
    
  }

  /**
* evalua si debe aparecer boton de limpiar todos los campos de filtro
*/
  viewTableButton(button) {
    return !!this.tableButtons && !!this.tableButtons[button] ? this.tableButtons[button] : false;
  }

  ngAfterViewInit() {
    if (this.data.length !== 0 && !!this.filteredData && !!this.primeTable) {
      if (!this.filtered) {
        this.filtered = true;
        this.filteringTableData(this.filteredData);

      }
    }
  }

  ngAfterViewChecked() {
    if (!this.filledOnce && this.columns.length !== 0) {
      this.filteredColumns = this.columns.map((column) => column.field);
      this.filledOnce = true;
    }

  }
}
