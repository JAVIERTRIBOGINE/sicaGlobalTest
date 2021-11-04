import { AfterViewChecked, AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from 'src/app/core/config/const';
import * as constants from 'src/app/core/config/const';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router, RoutesRecognized } from '@angular/router';
import { AccountService } from './core/services/account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from './core/services/auth.service';
import { Navigation } from 'selenium-webdriver';
import { warn } from 'console';
import { Subscription } from 'rxjs';


@Component({
  selector: 'sica-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'acciona-sicue-frontend';
  routing: boolean = false;
  defUrl: string = "";
  routerSubscription: Subscription;
  routerSubscriptionTest: Subscription;
  constructor(
    public oidcSecurityService: OidcSecurityService,
    private accountService: AccountService,
    private authService: AuthService,
    public translate: TranslateService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService
  ) {

    this.routerSubscription = this.router.events.subscribe(e => {
      
      if (e instanceof NavigationStart) 
        if (!sessionStorage.getItem('realUrl')) sessionStorage.setItem('realUrl', e.url);
    });
    this.translate.addLangs([constants.LANGUAGES.SPANISH, constants.LANGUAGES.CATALAN]);
    this.translate.setDefaultLang(constants.LANGUAGES.SPANISH);
  }
  ngOnInit() {
    // se aplica este control por las recargas de página (no pasaran por el )
    // ids4
    this.ngxLoader.start();
    this.oidcSecurityService.isAuthenticated$.subscribe(auth => {
      if (!auth) {
        this.oidcSecurityService.checkAuth().subscribe(ok => {
          if (ok) {
            
            this.authService.setAuthorized(true);
            this.accountService.buildPermissionsObject();

            // this.router.navigate(["/" + sessionStorage.getItem('realUrl')]); ** se mantiene
            if (!!sessionStorage.getItem('realUrl')) this.router.navigate([sessionStorage.getItem('realUrl')]);

          } else {
            this.oidcSecurityService.authorize();
          }
        },
          er => console.warn('error en checkauth: ', er),
          () => this.ngxLoader.stop()
        );
      } 
    })

    if (!!sessionStorage.getItem('angular_spa_userData')) {
      this.authService.setAuthorized(true);
      this.accountService.buildPermissionsObject();

    }
    this.primengConfig.ripple = true;

  }

  
  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
