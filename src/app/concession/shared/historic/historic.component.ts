import { Component, OnInit } from '@angular/core';
import { Actions, AuditDataModel, DataModel } from 'src/app/shared/models/audit';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/core/services/api.service';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import * as ENTITIES from 'src/app/core/models/entities';
import { environment } from 'src/environments/environment';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/core/services/account.service';


@Component({
  selector: 'sica-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.scss'],
  providers: [ MessageService, TranslateService]

})
export class HistoricComponent implements OnInit {
  entityConcessionSlug: string;
  constantEntitieConfig: INTERFACES.entityConfigData;
  idConcession: string;
  concessionSlug: string;
  auditDataModel: AuditDataModel[] = [];
  staticConcessionSlug: string;

  constructor(
    private apiService: ApiService,
    private _Activatedroute: ActivatedRoute,
    private translate: TranslateService,
    public dataTransferService: DataTransferService,
    private ngxUiLoaderService: NgxUiLoaderService,
    public customMessageService: CustomMessageService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
    ) { }

  id: string;
  data: ENTITIES.Historic[];

  ngOnInit(): void {
    
    let validUrl = this.router.url.split('/');
    validUrl.splice(0, 1);
    [this.staticConcessionSlug, this.concessionSlug, this.entityConcessionSlug, this.id]= validUrl;
      this.idConcession = this.accountService.getIdConcession(this.concessionSlug);   
      this.constantEntitieConfig = constants.ENTITY_REFERENCES[this.entityConcessionSlug.toUpperCase()];
      let entityEndpoint = this.constantEntitieConfig['api_reference'].GET_BY_ID.replace(':idConcession', this.idConcession).replace(":id", this.id);

      entityEndpoint += environment.endpoints.historics;
      this.ngxUiLoaderService.start();
      this.apiService.getDataById(entityEndpoint).subscribe(result => {
          if( !!result ) {
            this.parseDataToAuditModel(result.data);
          }
        },
        (error) =>   console.warn("error", error.message),
        () => {
          this.ngxUiLoaderService.stop();
          if (!!this.customMessageService.getToastMessage()) {
            this.messageService.add(
              this.customMessageService.getToastMessage()
            );
          }
        }
      )
  }

  conformSlugs(id: string, entity:string){
    let entityEndpoint = this.constantEntitieConfig.api_reference;
    let historicSlug = environment.endpoints.historics;
    return entityEndpoint + "/" + historicSlug
  }

  parseDataToAuditModel(historicData) : void {
    
    historicData.forEach(value => {
      const model: AuditDataModel = {
        selector: this.getDateString(value?.fechaModificacion),
        action: this.getAction(value),
        data: [
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.TITLE'), value: value?.title },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.DESCRIPTION'), value: value?.descripcion },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.VALUE'), value: value?.valor?.toString() },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.UPDATE_DATA'), value: this.getDateString(value?.fechaModificacion) },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.CREATE_DATA'), value: this.getDateString(value?.fechaAlta) },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.REMOVE_DATA'), value: this.getDateString(value?.fechaBaja) },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.UPDATE_USER'), value: value?.usuarioModificador },
          { name: this.translate.instant('READINGS.HISTORIC.FIELDS.CREATE_USER'), value: value?.usuarioCreador },
        ]
      };
      
      this.auditDataModel.push(model);
    })
    this.auditDataModel.sort((a,b)=>a.selector>b.selector?-1:1);
  }

  getAction(historic: ENTITIES.Historic) : Actions {
    if(new Date(historic.fechaModificacion).toUTCString() == new Date(historic.fechaAlta).toUTCString()) 
      return Actions.New;
      else if(new Date(historic.fechaModificacion).toUTCString() == new Date(historic.fechaBaja).toUTCString())
      return Actions.Remove;
    else 
      return Actions.Update;
  }

  getDateString(date: Date) : string {
    if(date) {
      return new Date(date).toString()
    }

    return null;
  }

  get historicData() {
    
    return this.auditDataModel.length !== 0;
  }
}
