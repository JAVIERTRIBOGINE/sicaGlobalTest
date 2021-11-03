import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import { JsonService } from 'src/app/core/services/json.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';
import { Observable, Subscription } from 'rxjs';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AccountService } from 'src/app/core/services/account.service';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { ApiService } from '../../core/services/api.service';
import { RouterService } from '../../core/services/router.servcice';
import { changeDateToIso } from '../../core/services/utils.service';

@Component({
  selector: 'sica-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [MessageService]
})
export class AccountComponent implements OnInit, OnDestroy {
  today: Date = new Date()
  generalDataTitle: string;
  formatSettingsTitle: string;
  permissionsDataTitle: string;
  action: string = "edit";
  accountPermissions: any[] = [];
  jsonFile: string;
  accountReference: INTERFACES.entityConfigData = constants.ENTITY_REFERENCES.ACCOUNT;
  jsonData: INTERFACES.jsonFormsData = null;
  subsJson$: Subscription = new Subscription();
  editData: any = { value: null };
  language$: Observable<string>;
  subsLan: Subscription = new Subscription();
  subsTranslate: Subscription = new Subscription();
  entityEndpoint: INTERFACES.apiReference;


  constructor(
    public translate: TranslateService,
    public accountService: AccountService,
    public routerService: RouterService,
    public apiService: ApiService,
    private jsonService: JsonService,
    private languageService: LanguageService,
    public customMessageService: CustomMessageService,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.routerService.conformNewSearchModulesData(this.router);
    this.entityEndpoint = this.routerService.getPossibleEndpoints();
    this.language$ = this.languageService.watchLanguage();
    this.subsLan = this.language$.subscribe(lan => {
      this.subsTranslate = this.translate.use(lan).subscribe(translation => {
        this.translateLabels();
      })
    });
  }
  
  ngOnInit(): void {
    this.routerService.conformNewSearchModulesData(this.router);
    // this.routerService.conformUsersModulesData(this.router.url);
    this.entityEndpoint = this.routerService.getPossibleEndpoints();
    this.assignValuesFromUrl();
  }

  assignValuesFromUrl() {
    this.editData.data = JSON.parse(sessionStorage.getItem("userSettings"));
    this.jsonFile = this.routerService.getEntitieReference()['jsonUserFormFileName'];
    this.subsJson$ = this.jsonService.readAllFile(this.jsonFile).subscribe(result => {
      this.jsonData = result;
    })
    
  }
  
  translateLabels() {
    this.generalDataTitle = this.translate.instant("GENERAL.TITLES.USER.PERSONAL_DATA");
    this.formatSettingsTitle = this.translate.instant("GENERAL.TITLES.USER.FORMAT_SETTINGS");
    this.permissionsDataTitle = this.translate.instant("GENERAL.TITLES.USER.PERMISSIONS_DATA");
  }
  
  customSubmit(event) {
    this.entityEndpoint = this.routerService.getPossibleEndpoints();
  
    let finalevent = changeDateToIso(this.jsonData.area, event);
    this.apiService.putData(this.entityEndpoint['PUT'], finalevent).subscribe(data => {
      // se conforma el mensaje toast success en un servicio especial
      this.customMessageService.buildToastMessage(data, "EDIT", "SUCCESS");
      this.updateCachedUserSettings(event);
      this.languageService.setLanguage(event['idiomaPreferido']);
      this.router.navigate(['/']);
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

  updateCachedUserSettings(values) {
    let userSettings = JSON.parse(sessionStorage.getItem('userSettings'));
    userSettings.formatoFechaHora = values.formatoFechaHora;
    userSettings.formatoNumerico = values.formatoNumerico;
    userSettings.idiomaPreferido = values.idiomaPreferido;
    sessionStorage.setItem('userSettings', JSON.stringify(userSettings));
  }


  ngOnDestroy() {
    this.subsTranslate.unsubscribe();
    this.subsLan.unsubscribe()
  }

}
