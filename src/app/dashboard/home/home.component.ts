import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Catalog } from 'src/app/core/models/other-interfaces';
import { AccountService } from 'src/app/core/services/account.service';
import { CustomMessageService } from 'src/app/core/services/custom-message.service';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'sica-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ MessageService ]
})
export class HomeComponent implements OnInit, OnDestroy {

  language$: Observable<string>;
  subscription$: Subscription = new Subscription();
  subsLan: Subscription = new Subscription();
  subsTrans: Subscription = new Subscription;
  constructor(
    private dictionaryService: DictionaryService,
    private translate: TranslateService,
    private accountService: AccountService,
    private languageService: LanguageService,
    public messageService: MessageService,
    public customMessageService: CustomMessageService
  ) {
    this.language$ = this.languageService.watchLanguage();
    this.updatingtranslations();
  }

  ngOnInit(): void {
    // se cargan los catálogos
    this.showMessages()
    // this.dictionaryService.loadCatalogs();
  }
  /**
   * Cambios de traducciones ante posibles cambios de lenguage
   */
  updatingtranslations() {
    this.subsLan = this.language$.subscribe(value => {
      this.translate.currentLang = this.accountService.userData.idiomaPreferido;
      this.subsTrans = this.translate.use(value).subscribe(translation => { })
    });
  }

  showMessages(){
    if (!!this.customMessageService.getToastMessage()) {
      let toastMess = this.customMessageService.getToastMessage();
      this.messageService.add(
        toastMess
      );
      this.customMessageService.clearToastMessage();
  
    }
  }
  
  ngOnDestroy(){
    this.subsLan.unsubscribe();
    this.subsTrans.unsubscribe();
  }

}
