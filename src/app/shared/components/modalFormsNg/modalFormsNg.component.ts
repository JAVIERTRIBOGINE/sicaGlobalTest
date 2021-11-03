import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonService } from 'src/app/core/services/json.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { changeDateToIso } from 'src/app/core/services/utils.service';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import {  Router } from '@angular/router';
import { LanguageService } from 'src/app/core/services/language.service';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { RouterService } from 'src/app/core/services/router.servcice';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'sica-modalFormsNg',
  templateUrl: './modalFormsNg.component.html',
  styleUrls: ['./modalFormsNg.component.scss'],
})
export class ModalFormsNgComponent implements OnInit, OnDestroy {

  // Datos de registros de tablas de formularios con multiregistros
  public records: object[] = [];
  //

  // campos de los registros de tablas de formularios con multiregistros
  public recordsColumns: any[] = [];

  formSubmit: boolean;

  subsJson$: Subscription = new Subscription();
  subsApiJson$: Subscription = new Subscription();
  // Formgroup que recoge todos los formcontrols del formularo
  globalForm: FormGroup;

  // datos de los campos del formulario en el json
  formAreas: any[] = [];


  jsonData: any;


  // booleanos que permiten visualizar elementos html cuando los datos estén cargados
  formLoaded: boolean = false;
  tableLoaded: boolean = false;
  searchAreas: INTERFACES.searchAreas[];

  action: any;
  editData: any;
  entity: string;
  allLoaded: boolean = false;

  constructor(
    public primengConfig: PrimeNGConfig,
    public jsonService: JsonService,
    public apiService: ApiService,
    public router: Router,
    public routerService: RouterService,
    public languageService: LanguageService,
    public messageService: MessageService,
    public customMessageService: CustomMessageService,
    public dictionaryService: DictionaryService,
    public ngxUiLoaderService: NgxUiLoaderService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.editData = this.config.data.rowData;
  }

  ngOnInit(): void {
    this.entity = this.config.data.entity;
      this.standardReadingJson();
  }

  standardReadingJson() {
    this.editData = { data: this.config.data.rowdata }
    this.subsJson$ = this.jsonService.readAllFile(this.config.data.jsonFile).subscribe(result => {
      this.jsonData = result;
      this.searchAreas = result.area;
      // se mete este condicional porque la lectur del json del formulario de concesion es distinta, y
      // de momento no se leen catalogos sino que sus valores ya vienen en el json 
      this.dictionaryService.catalogsForForm(this.searchAreas);
      this.allLoaded = true;
    });
  }


  customSubmit(event) {
    switch (this.config.data.action) {
      case constants.Actions.EDIT:
        this.edit(event);
        break;
    }
  }

  private edit(values) {

    let finalValues = changeDateToIso(this.jsonData.area, values);

    finalValues.activo = true;
    this.apiService.putData(this.config.data.endpoint.put, finalValues).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "EDIT", "SUCCESS");
      this.ref.close(true);
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

  get formDataLoaded() {

    return this.jsonData !== null && this.jsonData !== undefined;
  }

  get isAllLoaded() {
    return this.allLoaded
  }

  ngOnDestroy() {
    this.subsApiJson$.unsubscribe()
    this.subsJson$.unsubscribe()
  }

}
