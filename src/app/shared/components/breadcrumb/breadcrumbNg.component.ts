import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { RouterService } from 'src/app/core/services/router.servcice';

@Component({
  selector: 'sica-breadcrumb',
  templateUrl: './breadcrumbNg.component.html',
  styleUrls: ['./breadcrumbNg.component.scss'],

})
export class BreadcrumbNgComponent implements OnInit, OnDestroy {
  language$: Observable<string>;
  items: MenuItem[] = [];
  home: MenuItem;
  subsLan: Subscription = new Subscription();
  subsTrans: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routerService: RouterService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private accountService: AccountService
    ) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.buildBreadcrumb(event.url);
        }

      });
      this.language$ = this.languageService.watchLanguage();
      this.subsLan = this.language$.subscribe(lang =>{
      this.subsTrans = this.translate.use(lang).subscribe(translation=>{

      })
      })


  }

  ngOnInit(): void {
    this.buildBreadcrumb(this.router.url);
  }

  buildBreadcrumb(url){
    this.items = [];
    this.items = this.items.concat(...this.routerService.breadcrumbItems);
  }

  ngOnDestroy() {
    this.subsLan.unsubscribe();
    this.subsTrans.unsubscribe();
  }
}
